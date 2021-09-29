"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAWSCredentials = exports.uploadS3object = exports.downloadS3object = void 0;
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const github_1 = require("./github");
const S3_BUCKET = 'exivity';
const S3_PREFIX = 'build';
const S3_REGION = 'eu-central-1';
function getS3url({ component, sha, usePlatformPrefix, prefix }) {
    const platformPrefix = (0, os_1.platform)() === 'win32' ? 'windows' : 'linux';
    return `s3://${S3_BUCKET}/${S3_PREFIX}/${component}/${sha}${usePlatformPrefix ? `/${platformPrefix}` : ''}${prefix ? `/${prefix}` : ''}`;
}
function downloadS3object({ component, sha, usePlatformPrefix, prefix, path, awsKeyId, awsSecretKey, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspacePath = (0, github_1.getWorkspacePath)();
        const src = getS3url({ component, sha, usePlatformPrefix, prefix });
        const dest = (0, path_1.resolve)(workspacePath, path);
        const cmd = `aws s3 cp --recursive --region ${S3_REGION} "${src}" "${dest}"`;
        (0, core_1.info)(`About to execute ${cmd}`);
        yield (0, exec_1.exec)(cmd, undefined, {
            env: Object.assign(Object.assign({}, process.env), { AWS_ACCESS_KEY_ID: awsKeyId, AWS_SECRET_ACCESS_KEY: awsSecretKey }),
        });
    });
}
exports.downloadS3object = downloadS3object;
function uploadS3object({ component, sha, usePlatformPrefix, prefix, path, awsKeyId, awsSecretKey, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspacePath = (0, github_1.getWorkspacePath)();
        const src = (0, path_1.resolve)(workspacePath, path);
        const isDirectory = (yield fs_1.promises.lstat(src)).isDirectory();
        const dest = getS3url({
            component,
            sha,
            usePlatformPrefix,
            prefix,
        });
        const cmd = [
            'aws',
            's3',
            'cp',
            isDirectory ? '--recursive' : '',
            '--region',
            S3_REGION,
            `"${src}"`,
            isDirectory ? `"${dest}"` : `"${dest}/${(0, path_1.basename)(path)}"`,
        ]
            .filter((item) => item)
            .join(' ');
        yield (0, exec_1.exec)(cmd, undefined, {
            env: Object.assign(Object.assign({}, process.env), { AWS_ACCESS_KEY_ID: awsKeyId, AWS_SECRET_ACCESS_KEY: awsSecretKey }),
        });
    });
}
exports.uploadS3object = uploadS3object;
function getAWSCredentials() {
    const awsKeyId = (0, core_1.getInput)('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID'];
    const awsSecretKey = (0, core_1.getInput)('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY'];
    // Assertions
    if (!awsKeyId || !awsSecretKey) {
        throw new Error('A required AWS input is missing');
    }
    return [awsKeyId, awsSecretKey];
}
exports.getAWSCredentials = getAWSCredentials;
