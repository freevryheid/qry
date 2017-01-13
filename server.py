#!/usr/bin/env python
# -*- coding: utf-8 -*-

import ast
import re
# import csv
import psycopg2
import psycopg2.extras
import simplejson
from bottle import Bottle, redirect, request, static_file

class DB:

    def __init__(self):
        pass

    def qry(self, con, query, args, one, commit):
        cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query, args)
        if commit:
            con.commit()
            res = 0
        else:
            r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
            res = (r[0] if r else None) if one else r
        con.close()
        return res

    def iqry(self, query, args=(), one=False, commit=False):
        con = psycopg2.connect(database="smgr", user="grassy", password="")
        return self.qry(con, query, args, one, commit)

    def run(self, sql):
        q = self.iqry(sql)
        return simplejson.dumps(q)

    # def mixes(self):
    #     sql = "select * from hma_mixes;"
    #     q = self.iqry(sql)
    #     return q


class QRY(Bottle):

    def __init__(self, db):
        super(QRY, self).__init__()
        self.db = db
        self.route("/", callback=self.index)
        self.route("/static/<filename:path>", callback=self.send_static)
        self.route("/qryDB", callback=self.qryDB)

    def index(self):
        redirect("/static/index.html")

    def send_static(self, filename):
        return static_file(filename, root="/home/grassy/qry/static")

    def qryDB(self):
        value = request.query.value
        agency = request.query.agency
        level = request.query.level
        mixArray = request.query.mixArray
        mixArray = ast.literal_eval(mixArray)
        countyArray = request.query.countyArray
        countyArray = ast.literal_eval(countyArray)
        fDate = request.query.fDate
        tDate = request.query.tDate
        sql1 = "select t1.*, t2.actl_cmpl_dt into temporary table tbl0 from rslt_%s_%s_vw t1 join hma_tst_vw t2 on t1.smpl_id = t2.smpl_id and t1.smpl_tst_nbr = t2.smpl_tst_nbr where t2.actl_cmpl_dt > 0;" % (value, agency)
        sql2 = ""
        if fDate:
            sql2 = "delete from tbl0 where to_date(cast(actl_cmpl_dt as text),'YYYYMMDD') <= %s;" % (fDate)
        sql3 = ""
        if tDate:
            sql3 = "delete from tbl0 where to_date(cast(actl_cmpl_dt as text),'YYYYMMDD') >= %s;" % (tDate)
        sql4 = "select t1.*, t2.mix into temporary table tbl1 from tbl0 t1 join hma_rslt_mix t2 on t1.smpl_id = t2.smpl_id and t1.smpl_tst_nbr = t2.smpl_tst_nbr;"
        sql5 = ""
        if mixArray:
            mixArray = str(tuple(mixArray))
            mixArray = re.sub(",\)$", ")", mixArray)
            sql5 = "delete from tbl1 where mix not in %s;" % (mixArray)
        sql6 = "select t1.*, t2.cont_id, t2.prj_nbr into temporary table tbl2 from tbl1 t1 join smpl t2 on t1.smpl_id = t2.smpl_id;"
        sql7 = "select t1.*, t2.county_number into temporary table tbl3 from tbl2 t1 join info t2 on trim(t1.prj_nbr) = trim(t2.info_csj);"
        sql8=""
        if countyArray:
            countyArray = str(tuple(countyArray))
            countyArray = re.sub(",\)$", ")", countyArray)
            sql8 = "delete from tbl3 where cast(county_number as text) not in %s;" % (countyArray)
        sql9 = "select t1.*, t2.cnam, t2.dnum into temporary table tbl4 from tbl3 t1 join county t2 on t1.county_number = t2.cnum;"
        sql10 = "select t1.*, t2.dnam into temporary table tbl5 from tbl4 t1 join district t2 on t1.dnum = t2.dnum;"
        sql11 = "copy tbl5 to 'testme.csv' csv header;"
        sql = sql1+sql2+sql3+sql4+sql5+sql6+sql7+sql8+sql9+sql10+sql11
        ret = db.iqry(sql)
        return ret

if __name__ == "__main__":
    db = DB()
    qry = QRY(db)
    # qry.run(host="localhost", port=8080, debug=True, reloader=True)
    qry.run(host="0.0.0.0", port=5000)
