import * as userdDb from "./userDb";
import * as chartDb from "./chartDb";
import * as dashboardDb from "./dashboardDb";

type IncludeParams = { [key: string]: boolean | IncludeParams };

const db = {
	...userdDb,
	...chartDb,
	...dashboardDb,
};

export default db;
