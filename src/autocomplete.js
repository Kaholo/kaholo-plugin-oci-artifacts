const identity = require("oci-identity");
const { getProvider, getArtifactsClient } = require('./helpers');
const parsers = require("./parsers")

// auto complete helper methods

function mapAutoParams(autoParams){
  const params = {};
  autoParams.forEach(param => {
    params[param.name] = parsers.autocomplete(param.value);
  });
  return params;
}

function handleResult(result, query, key){
  let items = result.items || result;
  if (!items || !Array.isArray(items) || items.length === 0) throw result;
  items = items.map(item => ({
    id: key ? item[key] : item.id, 
    value:  key ? item[key] :
            item.displayName ? item.displayName :
            item.name ? item.name : 
            item.id
  }));

  if (!query) return items;
  return items.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
}
 
// main auto complete methods

async function listCompartments(query, pluginSettings) {
  const settings = mapAutoParams(pluginSettings);
  const tenancyId = settings.tenancyId;
  const provider = getProvider(settings);
  const identityClient = await new identity.IdentityClient({
    authenticationDetailsProvider: provider
  });
  const result = await identityClient.listCompartments({ compartmentId: tenancyId });
  const compartments = handleResult(result, query);
  compartments.push({id: tenancyId, value: "Tenancy"});
  return compartments;
}

async function listContainerRepositories(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all container repos in the specified compartment
   */
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const client = getArtifactsClient(settings);
  const result = await client.listContainerRepositories({
    compartmentId: params.compartment || settings.tenancyId
  });
  return handleResult(result.containerRepositoryCollection, query);
}

async function listImages(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all images in the specified container repository
   * Must have compartmentId and containerRepository before
   */
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const client = getArtifactsClient(settings);
  const result = await client.listContainerImages({
    compartmentId: params.compartment || settings.tenancyId,
    repositoryId: params.containerRepository
  });
  return handleResult(result.containerImageCollection, query);
}

module.exports = {
  listCompartments,
  listContainerRepositories,
  listImages
}
