// Template registry — the product catalog. Every template listed here is
// automatically registered in Root.tsx (one composition per supported format)
// and becomes renderable by id through the renderer package.
import { VideoTemplate } from "./types";
import { logoSting } from "./logo-sting";
import { vibecloudDeploy } from "./vibecloud-deploy";
import { databaseGuide } from "./database-guide";
import { databaseIndex } from "./database-index";
import { frontendSecrets } from "./frontend-secrets";
import { yolocoAudienceFit } from "./yoloco-audience-fit";
import { aiInfluencer } from "./ai-influencer";
import { audienceOverlap } from "./audience-overlap";
import { raceCondition } from "./race-condition";
import { secretModel } from "./secret-model";
import { digitalRuble } from "./digital-ruble";
import { mrbeast100k } from "./mrbeast-100k";
import { btcSqueeze } from "./btc-squeeze";
import { phoneCheck } from "./phone-check";
import { khabySilence } from "./khaby-silence";
import { dollarWait } from "./dollar-wait";
import { noItInRussia } from "./no-it-in-russia";
import { brandsPayingMore } from "./brands-paying-more";
import { youtubeNetflix } from "./youtube-netflix";
import { gasolineInflation } from "./gasoline-inflation";
import { unicornCafe } from "./unicorn-cafe";
import { yoclipsPromo } from "./yoclips-promo";
import { yolocoMcp } from "./yoloco-mcp";
import { yolocoExplorer, yolocoExplorerRu } from "./yoloco-explorer";
import { dubaiEconomy } from "./dubai-economy";

export const templates: VideoTemplate<any>[] = [
  logoSting,
  vibecloudDeploy,
  databaseGuide,
  databaseIndex,
  frontendSecrets,
  yolocoAudienceFit,
  aiInfluencer,
  audienceOverlap,
  raceCondition,
  secretModel,
  digitalRuble,
  mrbeast100k,
  btcSqueeze,
  phoneCheck,
  khabySilence,
  dollarWait,
  noItInRussia,
  brandsPayingMore,
  youtubeNetflix,
  gasolineInflation,
  unicornCafe,
  yoclipsPromo,
  yolocoMcp,
  yolocoExplorer,
  yolocoExplorerRu,
  dubaiEconomy,
];
