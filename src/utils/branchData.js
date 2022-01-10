const {getData} = require('../bitriseAPI/dataFetcher');

/**
 * @param url The url the call will use.
 * @param branch Which branch's builds will be searched.
 * @param status The status of the workflow.
 * @returns {Promise<(*)[]>} The data of the builds and the number of builds.
 */
const getBranchData = async (url, branch, status) => {
    const rawData = await getData(url,
        [
            ['branch', `${branch}`],
            ['status', status]
        ]
    );
    return  [JSON.parse(rawData.body).data, JSON.parse(rawData.body).paging.total_item_count];
}

module.exports = {
    getBranchData
}