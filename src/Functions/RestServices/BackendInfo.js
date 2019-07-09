import {EnvHost} from './BackendHost'

export const GetGitInfo = () => {
    const url = EnvHost + '/commitId/';
    return fetch(url).then(response => response.json());
 }