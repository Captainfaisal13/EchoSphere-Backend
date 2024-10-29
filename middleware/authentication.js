const { UnauthorizedError } = require("../errors");
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");

const auth = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;
  // console.log({ refreshToken, accessToken });

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    payload = isTokenValid(refreshToken);

    const exisitingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!exisitingToken) {
      throw new UnauthorizedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: payload.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthorizedError("Authentication Invalid");
  }
};

module.exports = auth;
