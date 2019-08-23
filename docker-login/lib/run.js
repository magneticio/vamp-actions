"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
const command_1 = require("@actions/core/lib/command");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let username = core.getInput('username', { required: true });
        let password = core.getInput('password', { required: true });
        let loginServer = core.getInput('login-server', { required: true });
        let authenticationToken = new Buffer(`${username}:${password}`).toString('base64');
        let config = {
            "auths": {
                [loginServer]: {
                    auth: authenticationToken
                }
            }
        };
        const runnerTempDirectory = process.env['RUNNER_TEMP'] || ""; // Using process.env until the core libs are updated
        const dirPath = path.join(runnerTempDirectory, `docker_login_${Date.now()}`);
        yield io.mkdirP(dirPath);
        const dockerConfigPath = path.join(dirPath, `config.json`);
        core.debug(`Writing docker config contents to ${dockerConfigPath}`);
        fs.writeFileSync(dockerConfigPath, JSON.stringify(config));
        command_1.issueCommand('set-env', { name: 'DOCKER_CONFIG' }, dirPath);
        console.log('DOCKER_CONFIG environment variable is set');
    });
}
run().catch(core.setFailed);
