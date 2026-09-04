"use strict";

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { z } = require("zod");

const app = express();

const PORT =
  process.env.PORT || 3000;

app.disable("x-powered-by");


/* SECURITY HEADERS */

app.use(
  helmet({

    contentSecurityPolicy: {

      directives: {

        defaultSrc: ["'self'"],

        scriptSrc: ["'self'"],

        styleSrc: ["'self'"],

        imgSrc: [
          "'self'",
          "data:"
        ],

        fontSrc: ["'self'"],

        connectSrc: ["'self'"],

        objectSrc: ["'none'"],

        baseUri: ["'self'"],

        frameAncestors: ["'none'"],

        formAction: ["'self'"]

      }

    },

    referrerPolicy: {
      policy:
        "strict-origin-when-cross-origin"
    }

  })
);


app.use(
  express.json({
    limit: "10kb"
  })
);


app.use(
  express.urlencoded({
    extended: false,
    limit: "10kb"
  })
);


/* RATE LIMIT */

const contactLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    limit: 5,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {
      error:
        "Too many requests. Please try again later."
    }

  });


/* VALIDATION */

const contactSchema =
  z.object({

    name:
      z.string()
        .trim()
        .min(2)
        .max(80)
        .regex(
          /^[a-zA-ZÀ-ÿ .'-]+$/
        ),

    email:
      z.string()
        .trim()
        .email()
        .max(160),

    message:
      z.string()
        .trim()
        .min(10)
        .max(2000)

  });


/* CONTACT */

app.post(
  "/api/contact",
  contactLimiter,
  (req, res) => {

    const result =
      contactSchema.safeParse(
        req.body
      );


    if (!result.success) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Invalid form data."

        });

    }


    const {
      name,
      email,
      message
    } = result.data;


    console.log({

      receivedAt:
        new Date().toISOString(),

      name,

      email,

      message

    });


    return res.json({

      success: true,

      message:
        "Your message was received successfully."

    });

  }
);


/* STATIC FILES */

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);


/* 404 */

app.use(
  (req, res) => {

    res
      .status(404)
      .sendFile(
        path.join(
          __dirname,
          "public",
          "404.html"
        )
      );

  }
);


/* START */

app.listen(
  PORT,
  () => {

    console.log(
      `Portfolio 2026 running at http://localhost:${PORT}`
    );

  }
);