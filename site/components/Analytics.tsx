import { GOATCOUNTER_CODE } from "@/lib/config";

/** Mesure du tunnel — GoatCounter (open source, UE-friendly, sans cookies, sans bannière).
 *  DÉSACTIVÉ tant que GOATCOUNTER_CODE est vide. Pour activer :
 *  1. Crée un compte gratuit sur goatcounter.com (2 min), choisis un code (ex. « bsm »)
 *  2. Mets ce code dans GOATCOUNTER_CODE (site/lib/config.ts) → push
 *  Les clics clés sont déjà instrumentés via data-goatcounter-click :
 *  clic-achat · pdf-exemple
 *  (Option durcissement à l'activation : épingler la version gc.zgo.at/count.v4.js + integrity sha384.) */
export default function Analytics() {
  if (!GOATCOUNTER_CODE) return null;
  return (
    <script
      data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
      async
      src="https://gc.zgo.at/count.js"
      crossOrigin="anonymous"
    />
  );
}
