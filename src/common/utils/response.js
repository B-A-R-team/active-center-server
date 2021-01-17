/**
 * http自定义状态码
 */
export const httpState = {
  SUCCESS: 200,
  INVALID_PARAMS: 400,
  ERROR: 500,
  TOKENEFAIL: 10001,
};

/**
 * 状态码 -> 消息
 */
export const codeToMessage = {
  [httpState.SUCCESS]: 'success',
  [httpState.INVALID_PARAMS]: 'invalid params',
  [httpState.ERROR]: 'error',
  [httpState.TOKENEFAIL]: 'token fail',
};

/**
 * 封装响应数据
 * @param {Number} code 状态码
 * @param {unknown|unknown[]} data 数据
 * @param {String} message 消息
 */
export default function response(code, data, message = '') {
  return {
    code: Number(code),
    message: message || codeToMessage[code],
    data,
  };
}

/**
 * 成功的响应
 * @param {unknown|unknown[]} data 数据
 */
export function successResponse(data) {
  return response(httpState.SUCCESS, data);
}

/**
 * 服务端错误的响应
 * @param {String} message 消息
 */
export function errorResponse(message) {
  return response(httpState.ERROR, null, message);
}

/**
 * 返回token的响应
 * @param {unknown|unknown[]} data 数据
 * @param {string} token token
 */
export function responseWithToken(data, token) {
  return {
    code: 200,
    message: codeToMessage(200),
    data,
    token,
  };
}
