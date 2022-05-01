const DefinitionDisplay = ({selected}) => {

  const parseTags = (tagsArray) => {
    return tagsArray.map(tag => {
      switch(tag){
        case "&adj-i;":
          return "I-adjective"
        case "&adj-na;":
          return "Na-adjective"
        case "&adj-no;":
          return "Nouns which may take the genitive case particle `no'"
        case "&adj-pn;":
          return "pre-noun adjectival (rentaishi)"
        case "&adj-t;":
          return "`taru' adjective"
        case "&adj-f;":
          return "noun or verb acting prenominally (other than the above)"
        case "&adj;":
          return "former adjective classification (being removed)"
        case "&adv;":
          return "adverb (fukushi)"
        case "&adv-n;":
          return "adverbial noun"
        case "&adv-to;":
          return "adverb taking the `to' particle"
        case "&aux;":
          return "auxiliary"
        case "&aux-v;":
          return "auxiliary verb"
        case "&aux-adj;":
          return "auxiliary adjective"
        case "&conj;":
          return "conjunction"
        case "&ctr;":
          return "counter"
        case "&exp;":
          return "Expressions (phrases, clauses, etc.)"
        case "&int;":
          return "interjection (kandoushi)"
        case "&iv;":
          return "irregular verb"
        case "&n;":
          return "Noun (common)"
        case "&n-adv;":
          return "adverbial noun"
        case "&n-pref;":
          return "noun, used as a prefix"
        case "&n-suf;":
          return "noun, used as a suffix"
        case "&n-t;":
          return "noun (temporal)"
        case "&num;":
          return "numeric"
        case "&pn;":
          return "pronoun"
        case "&pref;":
          return "prefix"
        case "&prt;":
          return "particle"
        case "&suf;":
          return "suffix"
        case "&v1;":
          return "Ichidan verb"
        case "&v2a-s;":
          return "Nidan verb with 'u' ending (archaic)"
        case "&v4h;":
          return "Yodan verb with `hu/fu' ending (archaic)"
        case "&v4r;":
          return "Yodan verb with `ru' ending (archaic)"
        case "&v5;":
          return "Godan verb (not completely classified)"
        case "&v5aru;":
          return "Godan verb - -aru special class"
        case "&v5b;":
          return "Godan verb with `bu' ending"
        case "&v5g;":
          return "Godan verb with `gu' ending"
        case "&v5k;":
          return "Godan verb with `ku' ending"
        case "&v5k-s;":
          return "Godan verb - iku/yuku special class"
        case "&v5m;":
          return "Godan verb with `mu' ending"
        case "&v5n;":
          return "Godan verb with `nu' ending"
        case "&v5r;":
          return "Godan verb with `ru' ending"
        case "&v5r-i;":
          return "Godan verb with `ru' ending (irregular verb)"
        case "&v5s;":
          return "Godan verb with `su' ending"
        case "&v5t;":
          return "Godan verb with `tsu' ending"
        case "&v5u;":
          return "Godan verb with `u' ending"
        case "&v5u-s;":
          return "Godan verb with `u' ending (special class)"
        case "&v5uru;":
          return "Godan verb - uru old class verb (old form of Eru)"
        case "&v5z;":
          return "Godan verb with `zu' ending"
        case "&vz;":
          return "Ichidan verb - zuru verb - (alternative form of -jiru verbs)"
        case "&vi;":
          return "intransitive verb"
        case "&vk;":
          return "kuru verb - special class"
        case "&vn;":
          return "irregular nu verb"
        case "&vs;":
          return "noun or participle which takes the aux. verb suru"
        case "&vs-c;":
          return "su verb - precursor to the modern suru"
        case "&vs-i;":
          return "suru verb - irregular"
        case "&vs-s;":
          return "suru verb - special class"
        case "&vt;":
          return "transitive verb"
      }
    })
  }

  return(
    <div className='definition-wrapper'>
      <h1>
        <ruby>
          {selected.k_ele[0].keb} <rp>(</rp><rt>{selected.r_ele[0].reb}</rt><rp>)</rp>
        </ruby>
      </h1>
      <ol>
        {
          selected.sense.map((item, idx) => {
            return(
              <div key={idx} >
                <span className="pos" > {parseTags(item.pos).join(", ")} </span>
                <li className="definition">
                  {item.gloss.join(", ")}
                </li>
              </div>
            )
          })
        }
      </ol>
    </div>
  )
}
export default DefinitionDisplay