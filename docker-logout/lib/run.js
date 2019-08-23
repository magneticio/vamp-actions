"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const io = __importStar(require("@actions/io"));
const ioUtil = __importStar(require("@actions/io/lib/io-util"));
const core = __importStar(require("@actions/core"));
const command_1 = require("@actions/core/lib/command");
function run() {
    let pathToDockerConfig = process.env['DOCKER_CONFIG'];
    if (pathToDockerConfig && ioUtil.exists(pathToDockerConfig)) {
        io.rmRF(pathToDockerConfig); // Deleting the docker config directory
        core.debug(`${pathToDockerConfig} has been successfully deleted`);
    }
    ;
    command_1.issueCommand('set-env', { name: 'DOCKER_CONFIG' }, '');
    console.log('DOCKER_CONFIG environment variable unset');
}
run();
