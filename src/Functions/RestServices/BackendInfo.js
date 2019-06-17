export const GetGitInfo = () => {
    const url = 'http://localhost:8083/commitId/';
    return fetch(url).then(response => response.json());
 }