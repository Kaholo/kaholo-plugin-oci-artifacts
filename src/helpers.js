const common = require("oci-common");
const artifacts = require("oci-artifacts");
const child_process = require("child_process")

/***
 * @returns {common.SimpleAuthenticationDetailsProvider} OCI Auth Details Provider
 ***/
 function getProvider(settings){
    return new common.SimpleAuthenticationDetailsProvider(
        settings.tenancyId,     settings.userId,
        settings.fingerprint,   settings.privateKey,
        null,                   common.Region.fromRegionId(settings.region)
    );
}

/***
 * @returns {artifacts.ArtifactsClient} OCI Database Client
 ***/
function getArtifactsClient(settings){
    const provider = getProvider(settings);
    return new artifacts.ArtifactsClient({
      authenticationDetailsProvider: provider
    });
}

async function executeCmd(command){
	return new Promise((resolve,reject) => {
		child_process.exec(command, (error, stdout, stderr) => {
			if (error) {
			   return reject(error);
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
			}
			return resolve(stdout);
		});
	})
}
  
module.exports = {
    getProvider,
    getArtifactsClient,
    executeCmd
}