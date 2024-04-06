type TConfig = {
    apiAuthServiceAddress: string,
    entrypointServiceNginxAddress: string
}

export const GLOBAL_CONFIG: TConfig = {
    apiAuthServiceAddress: import.meta.env.VITE_APP_API_AUTH_SERVICE_ADDRESS,
    entrypointServiceNginxAddress: import.meta.env.VITE_APP_ENTRYPOINT_SERVICE_NGINX_ADDRESS,
}
