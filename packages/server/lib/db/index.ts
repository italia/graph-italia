import * as apiKeyDb from "./apiKeyDb";
import * as chartDb from "./chartDb";
import * as dashboardDb from "./dashboardDb";
import * as dataSourceDb from "./dataSourceDb";
import * as kpiGroupDb from "./kpiGroupDb";
import * as orgDb from "./orgDb";
import * as projectDb from "./projectDb";
import * as projectMgmtDb from "./projectMgmtDb";
import * as userdDb from "./userDb";
import * as userMergeDb from "./userMergeDb";

const db = {
	...userdDb,
	...userMergeDb,
	...chartDb,
	...dashboardDb,
	...dataSourceDb,
	...kpiGroupDb,
	...orgDb,
	...projectDb,
	...projectMgmtDb,
	...apiKeyDb,
};

export default db;
