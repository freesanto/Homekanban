
import { useEffect, useRef, useCallback } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import AutoIcon from "../icons/auto.svg";
import EyeIcon from "../icons/edit.svg";
import CloseIcon from "../icons/close.svg";
import MaskIcon from "../icons/mask.svg";
import PluginIcon from "../icons/plugin.svg";
import DragIcon from "../icons/drag.svg";
import NextImage from "next/image";
import Logo from "../icons/logo.png";
import ads1 from "../pic/IMG_2135.jpg";

import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showConfirm, showToast } from "./ui-lib";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey) {
        if (e.key === "ArrowUp") {
          chatStore.nextSession(-1);
        } else if (e.key === "ArrowDown") {
          chatStore.nextSession(1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
  const lastUpdateTime = useRef(Date.now());

  const toggleSideBar = () => {
    config.update((config) => {
      if (config.sidebarWidth < MIN_SIDEBAR_WIDTH) {
        config.sidebarWidth = DEFAULT_SIDEBAR_WIDTH;
      } else {
        config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
      }
    });
  };

  const onDragStart = (e: MouseEvent) => {
    // Remembers the initial width each time the mouse is pressed
    startX.current = e.clientX;
    startDragWidth.current = config.sidebarWidth;
    const dragStartTime = Date.now();

    const handleDragMove = (e: MouseEvent) => {
      if (Date.now() < lastUpdateTime.current + 20) {
        return;
      }
      lastUpdateTime.current = Date.now();
      const d = e.clientX - startX.current;
      const nextWidth = limit(startDragWidth.current + d);
      config.update((config) => {
        if (nextWidth < MIN_SIDEBAR_WIDTH) {
          config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
        } else {
          config.sidebarWidth = nextWidth;
        }
      });
    };

    const handleDragEnd = () => {
      // In useRef the data is non-responsive, so `config.sidebarWidth` can't get the dynamic sidebarWidth
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);

      // if user click the drag icon, should toggle the sidebar
      const shouldFireClick = Date.now() - dragStartTime < 300;
      if (shouldFireClick) {
        toggleSideBar();
      }
    };

    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
  };

  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragStart,
    shouldNarrow,
  };
}

export function RightBar(props: { className?: string }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragStart, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();

  useHotKey();

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
    > 
<div className={styles["sidebar-header"]}>
   

 
<a style={{ textDecoration: 'none' }} className="no-underline" href="https://maintenance.homekanban.com/" target="_blank">
  <div className={styles["sidebar-title"]}>房屋保养 </div> 
</a>

  <div className={styles["sidebar-sub-title"]}>北美房屋维修保养百科全书</div>

  <a href="https://maintenance.homekanban.com/" target="_blank" >
    <div className={styles["sidebar-logo"] + " no-dark"}>
      {/*<LogoIcon/>*/}
      <NextImage src={Logo.src} alt="logo" width={50} height={50} />
    </div>
  </a>

</div> 

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<MaskIcon />}
          text="新房验收"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=219")}
          shadow
          title="点击查看新房验收详情"
        />
      </div>
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<DragIcon />}
          text="冷暖系统"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=215")}
          shadow
          title="点击查看冷暖系统详情"
        />
      </div>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<EyeIcon />}
          text="地基结构"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=221")}
          shadow
          title="点击查看地基结构详情"
        />
      </div>
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<AutoIcon />}
          text="环境安全"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=247")}
          shadow
          title="点击查看环境安全详情"
        />
      </div>      
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<AddIcon />}
          text="供水管道"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=286")}
          shadow
          title="点击查看供水管道保养详情"
        />
      </div>
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<SettingsIcon />}
          text="电气系统"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=235")}
          shadow
        />
      </div>
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<MaskIcon />}
          text="其他设施"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=228")}
          shadow
          title="点击查看其他设施详情"
        />
      </div>

      <div className={styles["sidebar-header-bar"]}>
      <IconButton
          icon={<DragIcon />}
          text="紧急情况"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=230")}
          shadow
          title="点击查看紧急情况详情"
        />

      </div>
 
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<PluginIcon />}
          text="保养日历"
          className={styles["sidebar-bar-button"]}
          onClick={() => window.open("https://maintenance.homekanban.com/?p=237")}
          shadow
          title="点击查看保养日历详情"
        />
      </div>

      <div className={styles["sidebar-header"]}>
    
        <a style={{ textDecoration: 'none' }} className="no-underline" href="https://www.inspekhome.com/" target="_blank">
        <div  >
              {/*<LogoIcon/>*/}
              <NextImage src={ads1.src} alt="logo" width={200} height={200} />
            </div>
        </a>
          
      </div> 

    </div>
  );
}
