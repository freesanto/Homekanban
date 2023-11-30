import React from "react";
import styles from "./home.module.scss"; // 确保导入正确的样式文件
import { IconButton } from "./button";
import AddIcon from "../icons/add.svg";
// Header 组件 

// 导入图片资源
import Image from 'next/image';
import logoImg from "../icons/logo.png"; 

const Header = () => {

  return (
    <header className={styles.header}>
    
      <div className={styles["header-content"]}>
        {/* Logo 模块 */}
        <div className={`${styles["logo"]} ${styles.center}`} style={{ marginLeft: '200px' }}>
          <div className={styles["logo-content"]}>
            <Image src={logoImg} alt="Logo" width={50} height={50} />
          </div>
        </div>

        {/* 公司名称模块 */}
        <div className={`${styles["logo-content"]} ${styles.center}`}style={{ marginLeft: '15px' }}>
          <div>
            <span>Homekanban</span>
          </div>
          <div>北美房屋检查</div>
        </div>

        {/* 超链接菜单模块 */}
 
        <nav className={`${styles["nav"]} ${styles.center}`} style={{ marginLeft: '50px' }}>
          
          <a href="https://maintenance.homekanban.com/?p=219" target="_blank" rel="noopener noreferrer" title="点击查看新房验收详情">新房入住</a>
          <a href="https://maintenance.homekanban.com/?p=228" target="_blank" rel="noopener noreferrer" title="点击查看供水管道详情">供水管道</a>
          <a href="https://maintenance.homekanban.com/?p=221" target="_blank" rel="noopener noreferrer" title="点击查看冷暖系统详情">冷暖系统</a>
          <a href="https://maintenance.homekanban.com/?p=247" target="_blank" rel="noopener noreferrer" title="点击查看环境安全详情">环境安全</a>
          <a href="https://maintenance.homekanban.com/?p=221" target="_blank" rel="noopener noreferrer" title="点击查看地基结构详情">地基结构</a>
          <a href="https://maintenance.homekanban.com/?p=235" target="_blank" rel="noopener noreferrer" title="点击查看电气系统详情">电气系统</a>
          <a href="https://maintenance.homekanban.com/?p=228" target="_blank" rel="noopener noreferrer" title="点击查看其他设施详情">其他设施</a>
          <a href="https://maintenance.homekanban.com/?p=230" target="_blank" rel="noopener noreferrer" title="点击查看紧急情况详情">紧急情况</a>
          <a href="https://maintenance.homekanban.com/?p=237" target="_blank" rel="noopener noreferrer" title="点击查看保养日历详情">保养日历</a>
          <a href="https://www.homekanban.com/" rel="noopener noreferrer" title="点击查看AI房屋维修估价详情">AI维修估价</a>
          
        </nav>

      </div>

    </header>
  );
};

export default Header;
