import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';

import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';

const vampcliToolName = 'vamp';
const stableVampcliVersion = 'v0.0.53';
const stableVersionUrl = "";

function getExecutableExtension(): string {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }
    return '';
}

async function getStableVampcliVersion(): Promise<string> {
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
}

function getVampcliDownloadURL(version: string): string {
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

async function downloadVampcli(version: string): Promise<string> {
    let cachedToolpath = toolCache.find(vampcliToolName, version);
    let vampcliDownloadPath = '';
    if (!cachedToolpath) {
        try {
            vampcliDownloadPath = await toolCache.downloadTool(getVampcliDownloadURL(version));
            let newVampcliDownloadPath = path.join(path.dirname(vampcliDownloadPath), 'vamp');
            await fs.renameSync(vampcliDownloadPath, newVampcliDownloadPath)
            vampcliDownloadPath = newVampcliDownloadPath;
        } catch (exception) {
            throw new Error('DownloadVampcliFailed');
        }
        cachedToolpath = await toolCache.cacheFile(vampcliDownloadPath, vampcliToolName + getExecutableExtension(), vampcliToolName, version);
    }

    const vampcliPath = path.join(cachedToolpath, vampcliToolName + getExecutableExtension());
    fs.chmodSync(vampcliPath, '777');
    core.addPath(cachedToolpath);
    return vampcliPath;
}

async function run() {
    let version = core.getInput('version', { 'required': true });
    if (version.toLocaleLowerCase() === 'latest') {
        version = await getStableVampcliVersion();
    }
    let cachedPath = await downloadVampcli(version);
    console.log(`Vamp tool version: '${version}' has been cached at ${cachedPath}`);
    core.setOutput('vampcli-path', cachedPath);
}

run().catch(core.setFailed);