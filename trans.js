
/**
 * Plugin Name: Latin To Aksara Batak
 * Plugin URI: https://hurufbatak.id/
 * Description: A plugin to transliterate Latin text into Batak script according to the selected dialect.
 * Version: 1.0
 * Author: Ritonga Mulia
 * Author URI: https://dipasid.com/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: latin-to-aksara-batak
 */


// --- Dialek selector ---
function getLanguage() {
    const radios = document.getElementsByName("bahasa");
    for (let radio of radios) {
        if (radio.checked) return radio.value;
    }
    return "angkola-mandailing"; // default fallback
}

// --- Fungsi utama untuk transliterasi Latin ke Aksara Batak ---
function DoTransliterate(str) {
    if (!str || str.trim() === '') return '';
    str = str.toLowerCase();
    str = SuperTrim(str);

    let i = 0, pi = 0, ret = '', vowelFlag = false;

    while (i < str.length) {
        if (i > 0 && isVowel(str[i]) && isVowel(str[i - 1])) {
            // penanganan vokal berturut
        }

        if ((str[i] === ' ' || isPunct(str[i]) || isDigit(str[i])) || ((i - pi) > 5)) {
            ret += GetSound(str.substring(pi, i));
            if (str[i] === ' ') ret += ' ';
            else if (isPunct(str[i])) ret += str[i];
            pi = i + 1;
        } else if (isVowel(str[i]) && str[i] !== 'h') {
            vowelFlag = true;
        }

        i++;
    }

    if (pi < i) {
        ret += GetSound(str.substring(pi, i));
    }

    return SuperTrim(ret);
}

// --- Aksi tombol Transliterate ---
function DoAppendTransliteration() {
    const input = document.getElementById("inp_txt").value.trim();
    const output = document.getElementById("ta");
    output.value = DoTransliterate(input);
}

// --- Aksi tombol Salin ---
function copyOutput() {
    const ta = document.getElementById("ta");
    ta.select();
    document.execCommand("copy");
}

/* === Utilitas & Logika Translasi Detail === */
function SuperTrim(str) {
    str = str || '';
    return str.replace(/^\s*|\s*$/g, '').replace(/\s+/g, ' ');
}

function isDigit(a) {
    return /[0-9]/.test(a);
}

function isPunct(a) {
    return /[,.><?\/+=!@#$%^&*()\[\]{}|":;'\\]/.test(a);
}

function isVowel(a) {
    return /[aeiouéèêěôāīūō]/i.test(a);
}

function isConsonant(a) {
    return /[bcdfghjklmnpqrstvwxyz]/i.test(a);
}

function GetSound(str) {
    if (!str) return '';
    if (str.length === 1) {
        return ResolveCharacterSound(str[0]);
    }
    const core = GetCoreSound(str);
    const matra = GetMatra(str.substring(core.len));
    return core.CoreSound + matra;
}

function ResolveCharacterSound(c) {
    if (isConsonant(c)) return GetCoreSound(c).CoreSound + '᯲';
    return GetCoreSound(c).CoreSound;
}


/***************************
Function GetMatra
apabila huruf vokal, return matra (sandhangan swara)
****************************/
function GetMatra(str) {
	var i = 0;
	if (str.length < 1) {
		return "";
	}
	if (i < str.length) {
		str = str.substring(i);
	}
    //Aksara i (ᯤ) dan u (ᯥ) hanya digunakan untuk suku kata terbuka, misal
    // pada kata dan ina ᯤᯉ dan ulu ᯥᯞᯮ. Untuk suku kata tertutup yang diawali 
    // dengan bunyi i atau u, digunakanlah aksara a (ᯀ atau ᯁ) bersama 
    // diaktirik untuk masing-masing vokal, misal pada kata indung ᯀᯪᯉ᯲ᯑᯮᯰ dan
    // umpama ᯀᯮᯔ᯲ᯇᯔ
    //Huruf Latin kapital I dan U menghasilkan aksara-aksara "ina ni surat" 
    // ᯤ dan ᯥ, sementara huruf Latin kecil i dan u menghasilkan aksara-aksara 
    // "anak ni surat" ᯀᯪ dan ᯀᯮ.
	var matramapT= { //toba, pakpak, mandailing
		"e":'ᯩ', "é":'ᯩ', "i":'ᯪ', "o":'ᯬ', "u":'ᯮ', "x":'ᯧ',
		"A":'ᯀ', "E":'ᯀᯩ', "I":'ᯤ', "O":'ᯀᯬ', "U":'ᯥ', "X":'ᯀᯧ'
	} 
	var matramapS= { //simalungun
		"e":'ᯩ', "é":'ᯩ', "i":'ᯫ', "o":'ᯬ', "u":'ᯮ', "x":'ᯧ',
		"A":'ᯁ', "E":'ᯁᯩ', "I":'ᯤ', "O":'ᯁᯬ', "U":'ᯥ', "X":'ᯁᯧ'
	} 
	var matramapK= { //karo
		"e":'ᯩ', "é":'ᯩ', "i":'ᯫ', "o":'ᯭ', "u":'ᯬ', "x":'ᯧ',
		"A":'ᯀ', "E":'ᯀᯩ', "I":'ᯤ', "O":'ᯀᯭ', "U":'ᯥ', "X":'ᯀᯧ'
	}
    var matramap;
    var bahasa = getLanguage();
    if (bahasa == "karo") matramap = matramapK;
    else if (bahasa == "simalungun") matramap = matramapS;
    else //if (bahasa == "toba" || bahasa == "pakpak-dairi" || bahasa == "angkola-mandailing")
      matramap = matramapT;

	if(matramap[str]!==undefined) {
		return matramap[str];
	}
	return "";
}
/***************************
Function GetShift
apabila huruf bikonsonan, return karakter khusus
****************************/
function GetShift(str) {
    var bahasa = getLanguage();
	str = str.toLowerCase();
	if (str.indexOf("ng") == 0) {
		//suku kata diawali 'ng'
      if (str.indexOf("nga") == 0) { return { "CoreSound": "" + "ᯝ", "len": 3 };
      } else if (str.indexOf("nge") == 0) { return { "CoreSound": "" + "ᯝᯩ", "len": 3 };
      } else if (str.indexOf("ngi") == 0 && bahasa == "karo") { return { "CoreSound": "" + "ᯝᯫ", "len": 3 };
      } else if (str.indexOf("ngi") == 0) { return { "CoreSound": "" + "ᯝᯪ", "len": 3 };
      } else if (str.indexOf("ngo") == 0 && bahasa == "karo") { return { "CoreSound": "" + "ᯝᯭ", "len": 3 };
      } else if (str.indexOf("ngo") == 0) { return { "CoreSound": "" + "ᯝᯬ", "len": 3 };
      } else if (str.indexOf("ngu") == 0 && bahasa == "simalungun") { return { "CoreSound": "" + "ᯝᯯ", "len": 3 };
      } else if (str.indexOf("ngu") == 0) { return { "CoreSound": "" + "ᯝᯮ", "len": 3 };
      } else if (str.indexOf("ngg") == 0) { return { "CoreSound": "" + "ᯰᯎ", "len": 3 }; //contoh "hutonggohon"
      } else {
		return { "CoreSound": "ᯰ", "len": 2 }; //amisara (sandhangan / cecak)
      }
	} 
	if (str.indexOf("ny") == 0) {//suku kata diawali 'ny'
		return { "CoreSound": "ᯠ", "len": 2 };
	}
	if (str.indexOf("nd") == 0 && bahasa == "karo") {//nd-
		return { "CoreSound": "ᯢ", "len": 2 };
	} else if (str.indexOf("nd") == 0) {//nd-
		return { "CoreSound": "ᯉ᯲ᯑ", "len": 2 };
	}
	if (str.indexOf("mb") == 0 && bahasa == "karo") {//mb-
		return { "CoreSound": "ᯣ", "len": 2 };
	} else if (str.indexOf("mb") == 0 && bahasa == "simalungun") {//mb-
		return { "CoreSound": "ᯕ᯳ᯅ", "len": 2 };
	} else if (str.indexOf("mb") == 0) {//mb-
		return { "CoreSound": "ᯔ᯲ᯅ", "len": 2 };
	}
	return {
		"CoreSound": null, "len": 1
	}
	;
}
/***************************
Function GetCoreSound
return aksara nglegana
****************************/
function GetCoreSound(str) {
	var soundMapT = { //toba
		"A":"ᯀ", "E":"ᯀᯩ", "I":"ᯤ", "O":"ᯀᯬ", "U":"ᯥ", "X":"ᯀᯧ",
		"a":"ᯀ", "e":"ᯀᯩ", "i":"ᯤ", "o":"ᯀᯬ", "u":"ᯥ", "x":"ᯀᯧ", 
		"B":"ᯅ", "C":"ᯡ", "D":"ᯑ", "G":"ᯎ", "H":"ᯂ", "J":"ᯐ", "Z":"ᯐ", "K":"ᯄ᯦", "Q":"ᯂ", "L":"ᯞ",
		"M":"ᯔ", "N":"ᯉ", "P":"ᯇ", "F":"ᯇ", "R":"ᯒ", "S":"ᯘ", "T":"ᯗ", "V":"ᯋ", "W":"ᯍ", "Y":"ᯛ",
		"b":"ᯅ", "c":"ᯚ᯦", "d":"ᯑ", "g":"ᯎ", "h":"ᯂ", "j":"ᯐ", "z":"ᯐ", "k":"ᯄ᯦", "q":"ᯂ", "l":"ᯞ",
		"m":"ᯔ", "n":"ᯉ", "p":"ᯇ", "f":"ᯇ", "r":"ᯒ", "s":"ᯘ", "t":"ᯖ", "v":"ᯋ", "w":"ᯋ", "y":"ᯛ"
	}
	var soundMapS = { //simalungun
		"A":"ᯁ", "E":"ᯁᯩ", "I":"ᯤ", "O":"ᯁᯬ", "U":"ᯥ", "X":"ᯁᯧ", 
		"a":"ᯁ", "e":"ᯁᯩ", "i":"ᯁᯪ", "o":"ᯁᯬ", "u":"ᯁᯮ", "x":"ᯁᯧ", 
		"B":"ᯅ", "C":"ᯡ", "D":"ᯑ", "G":"ᯏ", "H":"ᯃ", "J":"ᯐ", "Z":"ᯐ", "K":"ᯃ", "Q":"ᯃ", "L":"ᯟ", 
		"M":"ᯕ", "N":"ᯉ", "P":"ᯈ", "F":"ᯈ", "R":"ᯓ", "S":"ᯙ", "T":"ᯖ", "V":"ᯌ", "W":"ᯌ", "Y":"ᯜ", 
		"b":"ᯅ", "c":"ᯡ", "d":"ᯑ", "g":"ᯏ", "h":"ᯃ", "j":"ᯐ", "z":"ᯐ", "k":"ᯃ", "q":"ᯃ", "l":"ᯟ",
		"m":"ᯕ", "n":"ᯉ", "p":"ᯈ", "f":"ᯈ", "r":"ᯓ", "s":"ᯙ", "t":"ᯖ", "v":"ᯌ", "w":"ᯌ", "y":"ᯜ"
	}
	var soundMapK = { //karo
		"A":"ᯀ", "E":"ᯀᯩ", "I":"ᯤ", "O":"ᯀᯬ", "U":"ᯥ", "X":"ᯀᯧ",
		"a":"ᯀ", "e":"ᯀᯩ", "i":"ᯀᯪ", "o":"ᯀᯬ", "u":"ᯀᯮ", "x":"ᯀᯧ",
		"B":"ᯆ", "C":"ᯠ", "D":"ᯑ", "G":"ᯎ", "H":"ᯀ", "J":"ᯐ", "Z":"ᯐ", "K":"ᯂ", "Q":"ᯂ", "L":"ᯞ",
		"M":"ᯔ", "N":"ᯉ", "P":"ᯇ", "F":"ᯇ", "R":"ᯒ", "S":"ᯘ", "T":"ᯖ", "V":"ᯋ", "W":"ᯋ", "Y":"ᯛ",
		"b":"ᯆ", "c":"ᯠ", "d":"ᯑ", "g":"ᯎ", "h":"ᯀ", "j":"ᯐ", "z":"ᯐ", "k":"ᯂ", "q":"ᯂ", "l":"ᯞ",
		"m":"ᯔ", "n":"ᯉ", "p":"ᯇ", "f":"ᯇ", "r":"ᯒ", "s":"ᯘ", "t":"ᯖ", "v":"ᯋ", "w":"ᯋ", "y":"ᯛ"
	}
	var soundMapAM = { //angkola-mandailing
		"A":"ᯀ", "E":"ᯀᯩ", "I":"ᯤ", "O":"ᯀᯬ", "U":"ᯥ", "X":"ᯀᯧ",
		"a":"ᯀ", "e":"ᯀᯩ", "i":"ᯀᯪ", "o":"ᯀᯬ", "u":"ᯀᯮ", "x":"ᯀᯧ",
		"B":"ᯅ", "C":"ᯚ᯦", "D":"ᯑ", "G":"ᯎ", "H":"ᯄ", "J":"ᯐ", "Z":"ᯐ", "K":"ᯄ᯦", "Q":"ᯂ", "L":"ᯞ",
		"M":"ᯔ", "N":"ᯊ", "P":"ᯇ", "F":"ᯇ", "R":"ᯒ", "S":"ᯚ", "T":"ᯖ", "V":"ᯋ", "W":"ᯋ", "Y":"ᯛ",
		"b":"ᯅ", "c":"ᯚ᯦", "d":"ᯑ", "g":"ᯎ", "h":"ᯄ", "j":"ᯐ", "z":"ᯐ", "k":"ᯄ᯦", "q":"ᯂ", "l":"ᯞ",
		"m":"ᯔ", "n":"ᯊ", "p":"ᯇ", "f":"ᯇ", "r":"ᯒ", "s":"ᯚ", "t":"ᯖ", "v":"ᯋ", "w":"ᯋ", "y":"ᯛ"
	}
	var soundMapPD = { //pakpak-dairi
		"A":"ᯀ", "E":"ᯀᯩ", "I":"ᯤ", "O":"ᯀᯬ", "U":"ᯥ", "X":"ᯀᯧ",
		"a":"ᯀ", "e":"ᯀᯩ", "i":"ᯀᯪ", "o":"ᯀᯬ", "u":"ᯀᯮ", "x":"ᯀᯧ",
		"B":"ᯅ", "C":"ᯘ", "D":"ᯑ", "G":"ᯎ", "H":"ᯀ", "J":"ᯐ", "Z":"ᯐ", "K":"ᯂ", "Q":"ᯂ", "L":"ᯞ",
		"M":"ᯔ", "N":"ᯉ", "P":"ᯇ", "F":"ᯇ", "R":"ᯒ", "S":"ᯘ", "T":"ᯖ", "V":"ᯋ", "W":"ᯍ", "Y":"ᯛ",
		"b":"ᯅ", "c":"ᯘ", "d":"ᯑ", "g":"ᯎ", "h":"ᯀ", "j":"ᯐ", "z":"ᯐ", "k":"ᯂ", "q":"ᯂ", "l":"ᯞ",
		"m":"ᯔ", "n":"ᯉ", "p":"ᯇ", "f":"ᯇ", "r":"ᯒ", "s":"ᯘ", "t":"ᯖ", "v":"ᯋ", "w":"ᯍ", "y":"ᯛ"
	}
    var soundMap;
    var bahasa = getLanguage();
    if (bahasa == "karo") soundMap = soundMapK;
    else if (bahasa == "simalungun") soundMap = soundMapS;
    else if (bahasa == "toba") soundMap = soundMapT;
    else if (bahasa == "pakpak-dairi") soundMap = soundMapPD;
    else if (bahasa == "angkola-mandailing") soundMap = soundMapAM;

	var h_shift = GetShift(str);
	var core = str;
	if (h_shift["CoreSound"] == null) {
		if (soundMap[str.charAt(0)]) core = soundMap[str.charAt(0)];
		return {
			"CoreSound": core,
			"len": 1
		}
		;
	} else {
		return h_shift;
	}
}
/***************************
Function ResolveCharacterSound
return tanda baca, digit, vokal, maupun nglegana+pangkon
****************************/
function ResolveCharacterSound(c) {
    var bahasa = getLanguage();
	var str = "" + c;
	var len = 0;
	if (isConsonant(str[0]) && (bahasa == "karo" || bahasa == "simalungun")) {
		return "" + GetCoreSound(str).CoreSound + "᯳"; //virama panongonan
	} else if (isConsonant(str[0])) {
		return "" + GetCoreSound(str).CoreSound + "᯲"; //virama pangolat
	} else {
		//if (isVowel(str[0])) {
		return "" + GetCoreSound(str).CoreSound;
	}
	/**/
}
