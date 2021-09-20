
/*** client/inc/rsa/jsbn.js ***/
var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);
function BigInteger(a,b,c) {
if(a != null)
if("number" == typeof a) this.fromNumber(a,b,c);
else if(b == null && "string" != typeof a) this.fromString(a,256);
else this.fromString(a,b);
}
_me = BigInteger.prototype;
_me.toString = function(b) {
if(this.s < 0) return "-"+this.negate().toString(b);
var k;
if(b == 16) k = 4;
else if(b == 8) k = 3;
else if(b == 2) k = 1;
else if(b == 32) k = 5;
else if(b == 4) k = 2;
else return this.toRadix(b);
var km = (1<<k)-1, d, m = false, r = "", i = this.t;
var p = this.DB-(i*this.DB)%k;
if(i-- > 0) {
if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = this.int2char(d); }
while(i >= 0) {
if(p < k) {
d = (this[i]&((1<<p)-1))<<(k-p);
d |= this[--i]>>(p+=this.DB-k);
}
else {
d = (this[i]>>(p-=k))&km;
if(p <= 0) { p += this.DB; --i; }
}
if(d > 0) m = true;
if(m) r += this.int2char(d);
}
}
return m?r:"0";
}
_me.negate = function() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
_me.abs = function() { return (this.s<0)?this.negate():this; }
_me.compareTo = function(a) {
var r = this.s-a.s;
if(r != 0) return r;
var i = this.t;
r = i-a.t;
if(r != 0) return r;
while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
return 0;
}
_me.bitLength = function() {
if(this.t <= 0) return 0;
return this.DB*(this.t-1)+this.nbits(this[this.t-1]^(this.s&this.DM));
}
_me.mod = function(a) {
var r = nbi();
this.abs().divRemTo(a,null,r);
if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
return r;
}
_me.modPowInt = function(e,m) {
var z;
if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
return this.exp(e,z);
}
function nbi() { return new BigInteger(null); }
function am1(i,x,w,j,c,n) {
while(--n >= 0) {
var v = x*this[i++]+w[j]+c;
c = Math.floor(v/0x4000000);
w[j++] = v&0x3ffffff;
}
return c;
}
function am2(i,x,w,j,c,n) {
var xl = x&0x7fff, xh = x>>15;
while(--n >= 0) {
var l = this[i]&0x7fff;
var h = this[i++]>>15;
var m = xh*l+h*xl;
l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
w[j++] = l&0x3fffffff;
}
return c;
}
function am3(i,x,w,j,c,n) {
var xl = x&0x3fff, xh = x>>14;
while(--n >= 0) {
var l = this[i]&0x3fff;
var h = this[i++]>>14;
var m = xh*l+h*xl;
l = xl*l+((m&0x3fff)<<14)+w[j]+c;
c = (l>>28)+(m>>14)+xh*h;
w[j++] = l&0xfffffff;
}
return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
BigInteger.prototype.am = am2;
dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
BigInteger.prototype.am = am1;
dbits = 26;
}
else {
BigInteger.prototype.am = am3;
dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
_me.int2char= function(n) { return BI_RM.charAt(n); }
_me.intAt = function(s,i) {
var c = BI_RC[s.charCodeAt(i)];
return (c==null)?-1:c;
}
_me.copyTo = function(r) {
for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
r.t = this.t;
r.s = this.s;
}
_me.fromInt = function(x) {
this.t = 1;
this.s = (x<0)?-1:0;
if(x > 0) this[0] = x;
else if(x < -1) this[0] = x+DV;
else this.t = 0;
}
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
_me.fromString = function(s,b) {
var k;
if(b == 16) k = 4;
else if(b == 8) k = 3;
else if(b == 256) k = 8;
else if(b == 2) k = 1;
else if(b == 32) k = 5;
else if(b == 4) k = 2;
else { this.fromRadix(s,b); return; }
this.t = 0;
this.s = 0;
var i = s.length, mi = false, sh = 0;
while(--i >= 0) {
var x = (k==8)?s[i]&0xff:this.intAt(s,i);
if(x < 0) {
if(s.charAt(i) == "-") mi = true;
continue;
}
mi = false;
if(sh == 0)
this[this.t++] = x;
else if(sh+k > this.DB) {
this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
this[this.t++] = (x>>(this.DB-sh));
}
else
this[this.t-1] |= x<<sh;
sh += k;
if(sh >= this.DB) sh -= this.DB;
}
if(k == 8 && (s[0]&0x80) != 0) {
this.s = -1;
if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
}
this.clamp();
if(mi) BigInteger.ZERO.subTo(this,this);
}
_me.clamp = function() {
var c = this.s&this.DM;
while(this.t > 0 && this[this.t-1] == c) --this.t;
}
_me.nbits = function(x) {
var r = 1, t;
if((t=x>>>16) != 0) { x = t; r += 16; }
if((t=x>>8) != 0) { x = t; r += 8; }
if((t=x>>4) != 0) { x = t; r += 4; }
if((t=x>>2) != 0) { x = t; r += 2; }
if((t=x>>1) != 0) { x = t; r += 1; }
return r;
}
_me.dlShiftTo = function(n,r) {
var i;
for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
for(i = n-1; i >= 0; --i) r[i] = 0;
r.t = this.t+n;
r.s = this.s;
}
_me.drShiftTo = function(n,r) {
for(var i = n; i < this.t; ++i) r[i-n] = this[i];
r.t = Math.max(this.t-n,0);
r.s = this.s;
}
_me.lShiftTo = function(n,r) {
var bs = n%this.DB;
var cbs = this.DB-bs;
var bm = (1<<cbs)-1;
var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
for(i = this.t-1; i >= 0; --i) {
r[i+ds+1] = (this[i]>>cbs)|c;
c = (this[i]&bm)<<bs;
}
for(i = ds-1; i >= 0; --i) r[i] = 0;
r[ds] = c;
r.t = this.t+ds+1;
r.s = this.s;
r.clamp();
}
_me.rShiftTo = function(n,r) {
r.s = this.s;
var ds = Math.floor(n/this.DB);
if(ds >= this.t) { r.t = 0; return; }
var bs = n%this.DB;
var cbs = this.DB-bs;
var bm = (1<<bs)-1;
r[0] = this[ds]>>bs;
for(var i = ds+1; i < this.t; ++i) {
r[i-ds-1] |= (this[i]&bm)<<cbs;
r[i-ds] = this[i]>>bs;
}
if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
r.t = this.t-ds;
r.clamp();
}
_me.subTo = function(a,r) {
var i = 0, c = 0, m = Math.min(a.t,this.t);
while(i < m) {
c += this[i]-a[i];
r[i++] = c&this.DM;
c >>= this.DB;
}
if(a.t < this.t) {
c -= a.s;
while(i < this.t) {
c += this[i];
r[i++] = c&this.DM;
c >>= this.DB;
}
c += this.s;
}
else {
c += this.s;
while(i < a.t) {
c -= a[i];
r[i++] = c&this.DM;
c >>= this.DB;
}
c -= a.s;
}
r.s = (c<0)?-1:0;
if(c < -1) r[i++] = this.DV+c;
else if(c > 0) r[i++] = c;
r.t = i;
r.clamp();
}
_me.multiplyTo = function(a,r) {
var x = this.abs(), y = a.abs();
var i = x.t;
r.t = i+y.t;
while(--i >= 0) r[i] = 0;
for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
r.s = 0;
r.clamp();
if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}
_me.squareTo = function(r) {
var x = this.abs();
var i = r.t = 2*x.t;
while(--i >= 0) r[i] = 0;
for(i = 0; i < x.t-1; ++i) {
var c = x.am(i,x[i],r,2*i,0,1);
if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
r[i+x.t] -= x.DV;
r[i+x.t+1] = 1;
}
}
if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
r.s = 0;
r.clamp();
}
_me.divRemTo = function(m,q,r) {
var pm = m.abs();
if(pm.t <= 0) return;
var pt = this.abs();
if(pt.t < pm.t) {
if(q != null) q.fromInt(0);
if(r != null) this.copyTo(r);
return;
}
if(r == null) r = nbi();
var y = nbi(), ts = this.s, ms = m.s;
var nsh = this.DB-this.nbits(pm[pm.t-1]);
if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
else { pm.copyTo(y); pt.copyTo(r); }
var ys = y.t;
var y0 = y[ys-1];
if(y0 == 0) return;
var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
var i = r.t, j = i-ys, t = (q==null)?nbi():q;
y.dlShiftTo(j,t);
if(r.compareTo(t) >= 0) {
r[r.t++] = 1;
r.subTo(t,r);
}
BigInteger.ONE.dlShiftTo(ys,t);
t.subTo(y,y);
while(y.t < ys) y[y.t++] = 0;
while(--j >= 0) {
var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {
y.dlShiftTo(j,t);
r.subTo(t,r);
while(r[i] < --qd) r.subTo(t,r);
}
}
if(q != null) {
r.drShiftTo(ys,q);
if(ts != ms) BigInteger.ZERO.subTo(q,q);
}
r.t = ys;
r.clamp();
if(nsh > 0) r.rShiftTo(nsh,r);
if(ts < 0) BigInteger.ZERO.subTo(r,r);
}
_me.invDigit = function() {
if(this.t < 1) return 0;
var x = this[0];
if((x&1) == 0) return 0;
var y = x&3;
y = (y*(2-(x&0xf)*y))&0xf;
y = (y*(2-(x&0xff)*y))&0xff;
y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;
y = (y*(2-x*y%this.DV))%this.DV;
return (y>0)?this.DV-y:-y;
}
_me.isEven = function() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
_me.exp = function(e,z) {
if(e > 0xffffffff || e < 1) return BigInteger.ONE;
var r = nbi(), r2 = nbi(), g = z.convert(this), i = this.nbits(e)-1;
g.copyTo(r);
while(--i >= 0) {
z.sqrTo(r,r2);
if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
else { var t = r; r = r2; r2 = t; }
}
return z.revert(r);
}
function Classic(m) { this.m = m; }
_me = Classic.prototype;
_me.convert = function(x) {
if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
else return x;
}
_me.revert = function(x) { return x; }
_me.reduce = function(x) { x.divRemTo(this.m,null,x); }
_me.mulTo = function(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
_me.sqrTo = function(x,r) { x.squareTo(r); this.reduce(r); }
function Montgomery(m) {
this.m = m;
this.mp = m.invDigit();
this.mpl = this.mp&0x7fff;
this.mph = this.mp>>15;
this.um = (1<<(m.DB-15))-1;
this.mt2 = 2*m.t;
}
_me = Montgomery.prototype;
_me.convert = function(x) {
var r = nbi();
x.abs().dlShiftTo(this.m.t,r);
r.divRemTo(this.m,null,r);
if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
return r;
}
_me.revert = function(x) {
var r = nbi();
x.copyTo(r);
this.reduce(r);
return r;
}
_me.reduce = function(x) {
while(x.t <= this.mt2)
x[x.t++] = 0;
for(var i = 0; i < this.m.t; ++i) {
var j = x[i]&0x7fff;
var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
j = i+this.m.t;
x[j] += this.m.am(0,u0,x,i,0,this.m.t);
while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
}
x.clamp();
x.drShiftTo(this.m.t,x);
if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}
_me.sqrTo = function(x,r) { x.squareTo(r); this.reduce(r); }
_me.mulTo = function(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

/*** client/inc/rsa/prng4.js ***/
function Arcfour() {
this.i = 0;
this.j = 0;
this.S = new Array();
}
_me = Arcfour.prototype;
_me.init = function(key) {
var i, j, t;
for(i = 0; i < 256; ++i)
this.S[i] = i;
j = 0;
for(i = 0; i < 256; ++i) {
j = (j + this.S[i] + key[i % key.length]) & 255;
t = this.S[i];
this.S[i] = this.S[j];
this.S[j] = t;
}
this.i = 0;
this.j = 0;
}
_me.next = function() {
var t;
this.i = (this.i + 1) & 255;
this.j = (this.j + this.S[this.i]) & 255;
t = this.S[this.i];
this.S[this.i] = this.S[this.j];
this.S[this.j] = t;
return this.S[(t + this.S[this.i]) & 255];
}
function prng_newstate() {
return new Arcfour();
}
var rng_psize = 256;

/*** client/inc/rsa/rng.js ***/
var rng_state;
var rng_pool;
var rng_pptr;
function SecureRandom() {}
_me = SecureRandom.prototype;
_me.nextBytes = function rng_get_bytes(ba) {
var i;
for(i = 0; i < ba.length; ++i) ba[i] = this.rng_get_byte();
}
function rng_seed_int(x) {
rng_pool[rng_pptr++] ^= x & 255;
rng_pool[rng_pptr++] ^= (x >> 8) & 255;
rng_pool[rng_pptr++] ^= (x >> 16) & 255;
rng_pool[rng_pptr++] ^= (x >> 24) & 255;
if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}
function rng_seed_time() {
rng_seed_int(new Date().getTime());
}
if(rng_pool == null) {
rng_pool = new Array();
rng_pptr = 0;
var t;
if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
var z = window.crypto.random(32);
for(t = 0; t < z.length; ++t)
rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
}
while(rng_pptr < rng_psize) {
t = Math.floor(65536 * Math.random());
rng_pool[rng_pptr++] = t >>> 8;
rng_pool[rng_pptr++] = t & 255;
}
rng_pptr = 0;
rng_seed_time();
}
_me.rng_get_byte = function() {
if(rng_state == null) {
rng_seed_time();
rng_state = prng_newstate();
rng_state.init(rng_pool);
for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
rng_pool[rng_pptr] = 0;
rng_pptr = 0;
}
return rng_state.next();
}

/*** client/inc/rsa/rsa.js ***/
function RSAKey() {
this.n = null;
this.e = 0;
this.d = null;
this.p = null;
this.q = null;
this.dmp1 = null;
this.dmq1 = null;
this.coeff = null;
}
_me = RSAKey.prototype;
_me.setPublic = function(N,E) {
if(N != null && E != null && N.length > 0 && E.length > 0) {
this.n = this.parseBigInt(N,16);
this.e = parseInt(E,16);
}
else
alert("Invalid RSA public key");
}
_me.encrypt = function(text) {
var m = this.pkcs1pad2(text,(this.n.bitLength()+7)>>3);
if(m == null) return null;
var c = this.doPublic(m);
if(c == null) return null;
var h = c.toString(16);
if((h.length & 1) == 0) return h; else return "0" + h;
}
_me.parseBigInt = function(str,r) {
return new BigInteger(str,r);
}
_me.linebrk = function(s,n) {
var ret = "";
var i = 0;
while(i + n < s.length) {
ret += s.substring(i,i+n) + "\n";
i += n;
}
return ret + s.substring(i,s.length);
}
_me.byte2Hex = function(b) {
if(b < 0x10)
return "0" + b.toString(16);
else
return b.toString(16);
}
_me.pkcs1pad2 = function(s,n) {
if(n < s.length + 11) {
alert("Message too long for RSA");
return null;
}
var ba = new Array();
var i = s.length - 1;
while(i >= 0 && n > 0) ba[--n] = s.charCodeAt(i--);
ba[--n] = 0;
var rng = new SecureRandom();
var x = new Array();
while(n > 2) {
x[0] = 0;
while(x[0] == 0) rng.nextBytes(x);
ba[--n] = x[0];
}
ba[--n] = 2;
ba[--n] = 0;
return new BigInteger(ba);
}
_me.doPublic = function(x) {
return x.modPowInt(this.e, this.n);
}