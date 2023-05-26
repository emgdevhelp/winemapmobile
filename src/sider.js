import React from "react";
import "./style.css";

const Sider = (map) => {
    function toggleSidebar() {
        const elem = document.getElementById('right');
        const button = document.getElementById('sider_btn');
        const collapsed = elem.classList.toggle('collapsed');
        button.classList.toggle('close');
        const padding = {};
                padding['right'] = collapsed ? 0 : 200; 
                    map.easeTo({
                    padding: padding,
                    duration: 3000
                });
                }
    return (
        <div>
        <div id="right" class="sidebar flex-center right" style={{position: "absolute", top: "0px", zIndex: 99}}>
            <div class="sidebar-content rounded-rect flex-center">
                <ul class="list" id="list">
                    <li class="cities">Москва
                      <ul id="msk">
                      </ul>
                    </li>
                    <li>Санкт-Петербург
                      <ul id="spb">
                      </ul>
                    </li>
                    <li>Барнаул
                        <ul id="brn">
                        </ul>
                    </li>
                    <li>Владивосток
                        <ul id="vld">
                        </ul>
                    </li>
                    <li>Екатеринбург
                      <ul id="ekb">
                      </ul>
                    </li>
                    <li>Йошкар-Ола
                        <ul id="yos">
                        </ul>
                    </li>
                    <li>Красноярск
                        <ul id="krs">
                        </ul>
                    </li>
                    <li>Нижний Новгород
                        <ul id="nzn">
                        </ul>
                    </li>
                    <li>Новосибирск
                        <ul id="nvb">
                        </ul>
                    </li>
                    <li>Ростов-на-Дону
                        <ul id="rst">
                        </ul>
                    </li>
                    <li>Сургут
                        <ul id="srg">
                        </ul>
                    </li>
                    <li>Томск
                        <ul id="tmk">
                        </ul>
                    </li>
                    <li>Тюмень
                        <ul id="tmn">
                        </ul>
                    </li>
                    <li>Ялта
                        <ul id="yal">
                        </ul>
                    </li>
                  </ul>    
            </div>
            </div>
            <div id="sider_btn" class="sidebar-toggle rounded-rect right"></div>
            </div>
    );
}

export default Sider;