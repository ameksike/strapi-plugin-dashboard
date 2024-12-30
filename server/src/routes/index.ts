"use strict";

import admin from "./index.admin";
import contentApi from "./index.content-api";

export default {
  "content-api": {
    type: "content-api",
    routes: [...contentApi]
  },
  admin: {
    type: "admin",
    routes: [...admin]
  }
}