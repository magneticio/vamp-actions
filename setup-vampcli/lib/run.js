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
const vampcliToolName = 'vamp';
const stableVampcliVersion = 'v0.0.53';
const stableVersionUrl = "";
function getExecutableExtension() {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }
    return '';
}
function getStableVampcliVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        /*return toolCache.downloadTool(stableVersionUrl).then((downloadPath) => {
            let version = fs.readFileSync(downloadPath, 'utf8').toString().trim();
            if (!version) {
                version = stableVampcliVersion;
            }
            return version;
        }, (error) => {
            core.debug(error);
            core.warning('GetStableVersionFailed');
            
        });*/
        return Promise.resolve(stableVampcliVersion);
    });
}
function getVampcliDownloadURL(version) {
    switch (os.type()) {
        case 'Linux':
            return util.format('https://github.com/magneticio/vampkubistcli/releases/download/%s/vamp-linux-amd64', version);
        case 'Darwin':
            return util.format('https://github.com/magneticio/vampkubistcli/releases/download/%s/vamp-darwin-amd64', version);
        case 'Windows_NT':
        default:
            return util.format('https://github.com/magneticio/vampkubistcli/releases/download/%s/vamp-windows-amd64', version);
    }
}
function downloadVampcli(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let cachedToolpath = toolCache.find(vampcliToolName, version);
        let vampcliDownloadPath = '';
        if (!cachedToolpath) {
            try {
                vampcliDownloadPath = yield toolCache.downloadTool(getVampcliDownloadURL(version));
                let newVampcliDownloadPath = path.join(path.dirname(vampcliDownloadPath), 'vamp');
                yield fs.renameSync(vampcliDownloadPath, newVampcliDownloadPath);
                vampcliDownloadPath = newVampcliDownloadPath;
            }
            catch (exception) {
                throw new Error('DownloadVampcliFailed');
            }
            cachedToolpath = yield toolCache.cacheFile(vampcliDownloadPath, vampcliToolName + getExecutableExtension(), vampcliToolName, version);
        }
        const vampcliPath = path.join(cachedToolpath, vampcliToolName + getExecutableExtension());
        fs.chmodSync(vampcliPath, '777');
        core.addPath(cachedToolpath);
        return vampcliPath;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let version = core.getInput('version', { 'required': true });
        if (version.toLocaleLowerCase() === 'latest') {
            version = yield getStableVampcliVersion();
        }
        let cachedPath = yield downloadVampcli(version);
        console.log(`Vamp tool version: '${version}' has been cached at ${cachedPath}`);
        core.setOutput('vampcli-path', cachedPath);
    });
}
run().catch(core.setFailed);
//# sourceMappingURL=run.js.map