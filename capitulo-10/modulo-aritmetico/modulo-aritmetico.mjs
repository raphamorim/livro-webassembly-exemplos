
function asmFunc(imports) {
 var Math_imul = Math.imul;
 var Math_fround = Math.fround;
 var Math_abs = Math.abs;
 var Math_clz32 = Math.clz32;
 var Math_min = Math.min;
 var Math_max = Math.max;
 var Math_floor = Math.floor;
 var Math_ceil = Math.ceil;
 var Math_trunc = Math.trunc;
 var Math_sqrt = Math.sqrt;
 function $0($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  return $0_1 + $1_1 | 0 | 0;
 }
 
 function $1($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  return $0_1 - $1_1 | 0 | 0;
 }
 
 function $2($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  return ($0_1 >>> 0) / ($1_1 >>> 0) | 0 | 0;
 }
 
 function $3($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  return Math_imul($0_1, $1_1) | 0;
 }
 
 return {
  "soma": $0, 
  "subtracao": $1, 
  "divisao": $2, 
  "multiplicacao": $3
 };
}

var retasmFunc = asmFunc({
});
export var soma = retasmFunc.soma;
export var subtracao = retasmFunc.subtracao;
export var divisao = retasmFunc.divisao;
export var multiplicacao = retasmFunc.multiplicacao;
