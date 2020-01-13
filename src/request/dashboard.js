import baseRequest from "../utils/request";
export default class Dashboard extends baseRequest{
    constructor() {
        super();
        this.baseURL = 'https://api.github.com';
        this.urls = {
            repository: '/repos/ant-design/ant-design'
        };
    }
    repositoryInfos () {
        return this.get(this.urls.repository)
    }

}
