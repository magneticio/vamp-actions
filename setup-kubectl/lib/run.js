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
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const toolCache = __importStar(require("@actions/tool-cache"));
const kubectlToolName = 'kubectl';
const stableKubectlVersion = 'v1.15.0';
const stableVersionUrl = 'https://storage.googleapis.com/kubernetes-release/release/stable.txt';
function getExecutableExtension() {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }
    return '';
}
function getkubectlDownloadURL(version) {
    switch (os.type()) {
        case 'Linux':
            return util.format('https://storage.googleapis.com/kubernetes-release/release/%s/bin/linux/amd64/kubectl', version);
        case 'Darwin':
            return util.format('https://storage.googleapis.com/kubernetes-release/release/%s/bin/darwin/amd64/kubectl', version);
        case 'Windows_NT':
        default:
            return util.format('https://storage.googleapis.com/kubernetes-release/release/%s/bin/windows/amd64/kubectl.exe', version);
    }
}
function getStableKubectlVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        return toolCache.downloadTool(stableVersionUrl).then((downloadPath) => {
            let version = fs.readFileSync(downloadPath, 'utf8').toString().trim();
            if (!version) {
                version = stableKubectlVersion;
            }
            return version;
        }, (error) => {
            core.debug(error);
            core.warning('GetStableVersionFailed');
            return stableKubectlVersion;
        });
    });
}
function downloadKubectl(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let cachedToolpath = toolCache.find(kubectlToolName, version);
        let kubectlDownloadPath = '';
        if (!cachedToolpath) {
            try {
                kubectlDownloadPath = yield toolCache.downloadTool(getkubectlDownloadURL(version));
            }
            catch (exception) {
                throw new Error('DownloadKubectlFailed');
            }
            cachedToolpath = yield toolCache.cacheFile(kubectlDownloadPath, kubectlToolName + getExecutableExtension(), kubectlToolName, version);
        }
        const kubectlPath = path.join(cachedToolpath, kubectlToolName + getExecutableExtension());
        fs.chmodSync(kubectlPath, '777');
        return kubectlPath;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let version = core.getInput('version', { 'required': true });
        if (version.toLocaleLowerCase() === 'latest') {
            version = yield getStableKubectlVersion();
        }
        let cachedPath = yield downloadKubectl(version);
        console.log(`Kubectl tool version: '${version}' has been cached at ${cachedPath}`);
        core.setOutput('kubectl-path', cachedPath);
    });
}
run().catch(core.setFailed);
//# sourceMappingURL=run.js.map