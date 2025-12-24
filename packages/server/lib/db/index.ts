import * as chartDb from "./chartDb";
import * as dashboardDb from "./dashboardDb";
import * as kpiGroupDb from "./kpiGroupDb";
import * as userdDb from "./userDb";

type IncludeParams = { [key: string]: boolean | IncludeParams };

const db = {
	...userdDb,
	...chartDb,
	...dashboardDb,
	...kpiGroupDb
};

export default db;
