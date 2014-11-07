/*
//
// DELETE for Alasql.js
// Date: 03.11.2014
// (c) 2014, Andrey Gershun
//
*/

yy.Delete = function (params) { return yy.extend(this, params); }
yy.Delete.prototype.toString = function() {
	var s = 'DELETE FROM '+this.table.toString();
	if(this.where) s += ' WHERE '+this.where.toString();
	return s;
}

yy.Delete.prototype.compile = function (db) {
//  console.log(11,this);

	var tableid = this.table.tableid;

	if(this.where) {
//		try {
//		console.log(this, 22, this.where.toJavaScript('r',''));
//	} catch(err){console.log(444,err)};
		var wherefn = new Function('r,params','return ('+this.where.toJavaScript('r','')+')');
//		console.log(wherefn);
		return function (params, cb) {
			var table = db.tables[tableid];
			table.dirty = true;
			var orignum = table.data.length;
			table.data = table.data.filter(function(r){return !wherefn(r,params);});
//			console.log('deletefn',table.data.length);
			if(cb) cb(orignum - table.data.length);
			return orignum - table.data.length;
		}
	} else {
		return function (params, cb) {
			var table = db.tables[tableid];
			table.dirty = true;
			var orignum = db.tables[tableid].data.length;
			table.data.length = 0;
			if(cb) cb(orignum);
			return orignum;
		};
	}

};
