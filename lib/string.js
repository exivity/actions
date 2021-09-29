"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = exports.sluggify = void 0;
const crypto_1 = __importDefault(require("crypto"));
function sluggify(str) {
    return str
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '-') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
exports.sluggify = sluggify;
function randomString(length) {
    return crypto_1.default
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .substr(0, length);
}
exports.randomString = randomString;
