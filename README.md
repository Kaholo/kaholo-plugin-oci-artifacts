# kaholo-plugin-oci-artifacts
Kaholo plugin for integration with Oracle Cloud Infrastructure (OCI) Artifacts Service. Includes OCIR(Registry Service) Inside.

## Settings
1. Auth Token (Vault) **Required for pull/push image** - OCI Auth Token to use for authenticating to registry service from docker.
2. Username or Email (String) **Required for pull/push image** - The username or email of the OCI user to use for authenticating to registry service from docker.
3. Use OCI Identity Provider (Boolean) **Optional** - Whether to use the Oracle Cloud Identity Service as the Identity provider for authenticating to registry service from docker. Default value is false. **Make sure to select this if you need to select "oracleidentitycloudservice" when logging in to the OCI console.**
4. Private Key (Vault) **Required** - Will be used to authenticate to the OCI API. Can be taken from Identity\Users\YOUR_USER\API keys.
5. User ID (String) **Required** - The OCID of the user to authenticate with.
6. Tenancy ID (String) **Required** - Tenancy OCID. Can be found in user profile.
7. Tenancy Namespace (String) **Required for pull/push image** - Tenancy Namespace. Can be found in tenancy resource page in the OCI Console, or in the main page of the Container Registry Service in the console also.
8. Fingerprint (Vault) **Required** -  Will be used to authenticate to the OCI API. Can be taken from Identity\Users\YOUR_USER\API keys.
9. Region (String) **Required** - Identifier of the region to create the requests in. 

## Method Create Container Repository
Creates a new container repository in the container registry of the specified compartment.

### Parameters
1. Compartment (Autocomplete) **Required** - The ID of the compartment to create the new repository in.
2. Name (String) **Required** - The name of the repository to create. Must contain only numbers and lowercase letters. Must start with a lowercase letter.
3. Public (Boolean) **Optional** - Whether to enable public access to the new repository or not. Default is false.
4. Read Me Type (Options) **Optional** - The type of read me file to attach to the repository. Possible Values are No Read Me/Markdown/Plain Text. If not specified, default value will be determined by Read Me Content. **If Read Me Content is empty, than Read Me Type value will be overwritten to 'No Read Me'.** Otherwise, default value is Plain Text.
5. Read Me Content (Text) **Optional** - If specified, create a readme file for this repository with the content specified.

## Method Push Image To Repo
Push a local docker image to the specified OCI container repository.
* Make sure you have docker installed on the agent running this method.

### Parameters
1. Auth Token (Vault) **Required for pull/push image** - OCI Auth Token to use for authenticating to registry service from docker.
2. Username or Email (String) **Required for pull/push image** - The username or email of the OCI user to use for authenticating to registry service from docker.
3. Compartment (Autocomplete) **Required** - The compartment the repository.
4. Container Repository (Autocomplete) **Required** - The container repository to push the image to.
5. Image Name (String) **Required** - The name\tag of the local docker image to push. Can either be any image tag, or already be in the format of: `<Region>.ocir.io/<Tenancy Namespace>/<Image Name>`. **If specified image tag\name that isn't in the mentiond format, make sure to check "Should Tag" Option**
6. Should Tag (Boolean) **Optional** - Whether to tag the specifie image before pushing it. **Required if image doesn't have a tag yet in the format of `<Region>.ocir.io/<Tenancy Namespace>/<Image Name>`**
7. Tag (String) **Required if Should Tag was checked** - The new image tag inisde the repository for the image to push. Only relevent in case "Should Tag" was checked.

## Method Pull Image From Repo
Pull a docker image from the specified OCI container repository.
* Make sure you have docker installed on the agent running this method.


### Parameters
1. Auth Token (Vault) **Required for pull/push image** - OCI Auth Token to use for authenticating to registry service from docker.
2. Username or Email (String) **Required for pull/push image** - The username or email of the OCI user to use for authenticating to registry service from docker.
3. Compartment (Autocomplete) **Required** - The compartment the repository.
4. Container Repository (Autocomplete) **Required** - The container repository to push the image to.
5. Image (Autocomplete) **Required** - The image to pull from the repository.

## Method Get Image
Get back information about the specified image. Can either provide image by selecting it from the autocomplete menu or by image name.

### Parameters
1. Compartment (Autocomplete) **Optional** - The compartment of the repository. If not specified will use tenancy as default.
2. Container Repository (Autocomplete) **Optional** - The container repository that stores the required image.
3. Image (Autocomplete) **Optional** - The container image to return information about.
4. Image Name (String) **Optional** - The name of the image resource in OCI to get info about.

* **Please Notice!** You must provide either Image or Image Name.