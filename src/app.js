const { getArtifactsClient, executeCmd } = require('./helpers');
const parsers = require("./parsers");

async function runDockerRepoCommand(action, settings){
  const {region, tenancyNamespace} = settings;
	let {authToken, username, containerRepository: repo, imageName, shouldTag, tag} = action.params;
  authToken = authToken || settings.authToken; username = username || settings.username;
  repo = repo && repo.value ? repo.value : repo;
  
  const isPull = action.method.name === "pullImage";
  if (isPull) {
    imageName = action.params.image && action.params.image.value ? action.params.image.value : action.params.image;
    imageName = `${region}.ocir.io/${tenancyNamespace}/${imageName}`;
  }
  

  if (!authToken || !username || !repo || !imageName || !region || !tenancyNamespace){
    throw "One of the required parameters was not provided";
  }
  username = `${tenancyNamespace}/${settings.useOracleIdProvider ? `oracleidentitycloudservice/` : ``}${username}`;
  const result = {};

  try {
    if (shouldTag){
      // new image name/tag should direct to oci host server and repo
      const newImageName = `${region}.ocir.io/${tenancyNamespace}/${repo}${tag ? `:${tag}` : ""}`;
      // tag image
      await executeCmd(`docker tag ${imageName} ${newImageName}`);
      imageName = newImageName; 
    }
    // login
    result.loginResult = await executeCmd(`docker login --username ${username} --password "${authToken}" ${region}.ocir.io`);
    // push or pull
    result.actionResult = await executeCmd(`docker ${isPull ? "pull" : "push"} ${imageName}`);
    // log out
    result.logoutResult = await executeCmd(`docker logout ${region}.ocir.io`);
  } 
  catch (err) {
    // hide auth token
    const errMsg = err.message.replace(authToken, '<AUTH_TOKEN>')
    throw {...result, errMsg};
  }
  return result;
}

async function createContainerRepository(action, settings) {
  const name = parsers.string(action.params.name);
  if (!name) throw "Must provide name for the repo!";
  if (!/^[a-z][a-z0-9]*$/.test(name)) throw "Repository name must contain only lowercase letters and numbers, and must start with a letter!";

  const readMeType = action.params.readmeContent ? action.params.readmeType || "TEXT_PLAIN" : "no";
  const client = getArtifactsClient(settings);
  return client.createContainerRepository({
    createContainerRepositoryDetails: {
      compartmentId: parsers.autocomplete(action.params.compartment) || settings.tenancyId,
      displayName: name,
      isPublic: parsers.boolean(action.params.isPublic),
      readme: readMeType === "no" ? undefined : {
        content: action.params.readmeContent,
        format: readMeType
      }
    }
  });
}

async function getImage(action, settings) {
  const client = getArtifactsClient(settings);
  const compartmentId = parsers.autocomplete(action.params.compartment) || settings.tenancyId;
  if (!action.params.image){
    if (action.params.imageName){
      action.params.image = (await client.listContainerImages({
        compartmentId,
        displayName: parsers.string(action.params.imageName),
        repositoryId: parsers.autocomplete(action.params.containerRepository)
      })).containerImageCollection.items[0].id;
    }
    else {
      throw "Must provide either Image ot Image Name";
    }
  }
  return client.getContainerImage({
    imageId: parsers.autocomplete(action.params.image)
  });
}

module.exports = {
  pushImage: runDockerRepoCommand,
  pullImage: runDockerRepoCommand,
  createContainerRepository,
  getImage,
  ...require("./autocomplete")
}

