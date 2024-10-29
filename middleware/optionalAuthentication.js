const { UnauthorizedError } = require("../errors");
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");

const auth = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    if (refreshToken) {
      const payload = isTokenValid(refreshToken);

      const existingToken = await Token.findOne({
        user: payload.user.userId,
        refreshToken: payload.refreshToken,
      });

      if (!existingToken) {
        return next();
      }

      attachCookiesToResponse({
        res,
        user: payload.user,
        refreshToken: payload.refreshToken,
      });

      req.user = payload.user;
      return next();
    }

    return next();
  } catch (error) {
    return next();
  }
};

module.exports = auth;
