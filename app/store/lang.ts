import { create } from "zustand";
import { persist } from "zustand/middleware";
import Fuse from "fuse.js";
import { getLang } from "../locales";
import { StoreKey } from "../constant";
import { nanoid } from "nanoid";

export interface Lang {
  id: string;
  isUser?: boolean;
  title: string;
  content: string;
  createdAt: number;
}

export interface LangStore {
  counter: number;
  langs: Record<string, Lang>;

  add: (lang: Lang) => string;
  get: (id: string) => Lang | undefined;
  remove: (id: string) => void;
  search: (text: string) => Lang[];
  update: (id: string, updater: (lang: Lang) => void) => void;

  getUserLangs: () => Lang[];
}

export const SearchService = {
  ready: false,
  builtinEngine: new Fuse<Lang>([], { keys: ["title"] }),
  userEngine: new Fuse<Lang>([], { keys: ["title"] }),
  count: {
    builtin: 0,
  },
  allLangs: [] as Lang[],
  builtinLangs: [] as Lang[],

  init(builtinLangs: Lang[], userLangs: Lang[]) {
    if (this.ready) {
      return;
    }
    this.allLangs = userLangs.concat(builtinLangs);
    this.builtinLangs = builtinLangs.slice();
    this.builtinEngine.setCollection(builtinLangs);
    this.userEngine.setCollection(userLangs);
    this.ready = true;
  },

  remove(id: string) {
    this.userEngine.remove((doc) => doc.id === id);
  },

  add(lang: Lang) {
    this.userEngine.add(lang);
  },

  search(text: string) {
    const userResults = this.userEngine.search(text);
    const builtinResults = this.builtinEngine.search(text);
    return userResults.concat(builtinResults).map((v) => v.item);
  },
};

export const useLangStore = create<LangStore>()(
  persist(
    (set, get) => ({
      counter: 0,
      latestId: 0,
      langs: {},

      add(lang) {
        const langs = get().langs;
        lang.id = nanoid();
        lang.isUser = true;
        lang.createdAt = Date.now();
        langs[lang.id] = lang;

        set(() => ({
          latestId: lang.id!,
          langs: langs,
        }));

        return lang.id!;
      },

      get(id) {
        const targetLang = get().langs[id];

        if (!targetLang) {
          return SearchService.builtinLangs.find((v) => v.id === id);
        }

        return targetLang;
      },

      remove(id) {
        const langs = get().langs;
        delete langs[id];
        SearchService.remove(id);

        set(() => ({
          langs: langs,
          counter: get().counter + 1,
        }));
      },

      getUserLangs() {
        const userLangs = Object.values(get().langs ?? {});
        userLangs.sort((a, b) =>
          b.id && a.id ? b.createdAt - a.createdAt : 0,
        );
        return userLangs;
      },

      update(id, updater) {
        const lang = get().langs[id] ?? {
          title: "",
          content: "",
          id,
        };

        SearchService.remove(id);
        updater(lang);
        const langs = get().langs;
        langs[id] = lang;
        set(() => ({ langs: langs }));
        SearchService.add(lang);
      },

      search(text) {
        if (text.length === 0) {
          // return all rompts
          return get().getUserLangs().concat(SearchService.builtinLangs);
        }
        return SearchService.search(text) as Lang[];
      },
    }),
    {
      name: StoreKey.Lang,
      version: 3,

      migrate(state, version) {
        const newState = JSON.parse(JSON.stringify(state)) as LangStore;

        if (version < 3) {
          Object.values(newState.langs).forEach((p) => (p.id = nanoid()));
        }

        return newState;
      },

      onRehydrateStorage(state) {
        const LANG_URL = "./lang.json";

        type LangList = Array<[string, string]>;

        fetch(LANG_URL)
          .then((res) => res.json())
          .then((res) => {
            let fetchLangs = [res.en, res.cn];
            if (getLang() === "cn") {
              fetchLangs = fetchLangs.reverse();
            }
            const builtinLangs = fetchLangs.map(
              (langList: LangList) => {
                return langList.map(
                  ([title, content]) =>
                    ({
                      id: nanoid(),
                      title,
                      content,
                      createdAt: Date.now(),
                    } as Lang),
                );
              },
            );

            const userLangs =
              useLangStore.getState().getUserLangs() ?? [];

            const allLangsForSearch = builtinLangs
              .reduce((pre, cur) => pre.concat(cur), [])
              .filter((v) => !!v.title && !!v.content);
            SearchService.count.builtin = res.en.length + res.cn.length;
            SearchService.init(allLangsForSearch, userLangs);
          });
      },
    },
  ),
);
