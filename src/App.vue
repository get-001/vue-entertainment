<template>
  <div id="app" class="container" style="padding:0;">
    <div class="head">
      <span class="title">谁是卧底</span>
      <mu-button fab color="primary" @click="startGame">
        <mu-icon value="send"></mu-icon>
      </mu-button>
    </div>
    <div class="body">
      <mu-container>
        <mu-expansion-panel :expand="panel === 'panel1'" @change="toggle('panel1')">
          <div slot="header">玩家人数：{{config.players}}</div>
          <mu-slider
            v-model="config.players"
            :min="4"
            :step="1"
            :max="20"
            @change="sliderChange('players')"
          />
        </mu-expansion-panel>
        <mu-expansion-panel :expand="panel === 'panel2'" @change="toggle('panel2')">
          <div slot="header">卧底数量：{{config.dinting}}</div>
          <mu-slider v-model="config.dinting" :min="1" :step="1" :max="config.dintingMax" />
        </mu-expansion-panel>
        <mu-expansion-panel :expand="panel === 'panel3'" @change="toggle('panel3')">
          <div slot="header">白板数量：{{config.blank}}</div>
          <mu-slider
            v-model="config.blank"
            :min="0"
            :step="1"
            :max="config.blankMax"
            :disabled="config.blankMax==0"
          />
        </mu-expansion-panel>
      </mu-container>
      <mu-container class="more-wrap">
        <div style="margin-bottom:10px;text-align:right;">
          <mu-button @click="showMore = !showMore">更多</mu-button>
        </div>
        <mu-flex class="mu-transition-row">
          <mu-col span="6">
            <mu-slide-top-transition>
              <div class="mu-transition-box mu-inverse" v-show="showMore">
                <mu-button @click="openAlert=true">
                  <span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>
                  自定义词语
                </mu-button>
              </div>
            </mu-slide-top-transition>
          </mu-col>
          <mu-col span="6">
            <mu-slide-bottom-transition>
              <div class="mu-transition-box mu-inverse" v-show="showMore">
                <mu-button>
                  <mu-checkbox v-model="customWords.isUse" value="eat" label="使用自定义"></mu-checkbox>
                </mu-button>
              </div>
            </mu-slide-bottom-transition>
          </mu-col>
        </mu-flex>
        <mu-flex class="mu-transition-row">
          <mu-col span="6">
            <mu-slide-left-transition>
              <div class="mu-transition-box mu-inverse" v-show="showMore">
                <mu-button>
                  <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                  设置
                </mu-button>
              </div>
            </mu-slide-left-transition>
          </mu-col>
          <mu-col span="6">
            <mu-slide-right-transition>
              <div class="mu-transition-box mu-inverse" v-show="showMore">
                <mu-button>
                  <span class="glyphicon glyphicon-indent-left" aria-hidden="true"></span>
                  关于
                </mu-button>
              </div>
            </mu-slide-right-transition>
          </mu-col>
        </mu-flex>
      </mu-container>
      <mu-dialog
        title="自定义词语"
        width="600"
        max-width="80%"
        :esc-press-close="false"
        :overlay-close="false"
        :open.sync="openAlert"
      >
        <mu-text-field style="margin:0;" v-model="customWords.dinting" label="卧底词语：" label-float></mu-text-field>
        <mu-text-field style="margin:0;" v-model="customWords.civilian" label="平民词语：" label-float></mu-text-field>

        <mu-button slot="actions" flat color="primary" @click="openAlert=false">ok</mu-button>
      </mu-dialog>
    </div>
    <mu-slide-right-transition>
      <CheckYourIdentity
        v-if="getInto"
        :gameArr="gameArr"
        @closePage="getInto=false"
        @open="showGameInterface=true"
      />
    </mu-slide-right-transition>
    <mu-slide-right-transition>
      <StartGame
        v-if="showGameInterface"
        :gameArr="gameArr"
        @closePage="showGameInterface=false"
        @startAgain="startAgain"
      />
    </mu-slide-right-transition>
  </div>
</template>

<script>
import CheckYourIdentity from "./views/CheckYourIdentity.vue";
import StartGame from "./views/StartGame.vue";

export default {
  components: { CheckYourIdentity, StartGame },
  data() {
    return {
      panel: "",
      config: {
        players: 5,
        dinting: 1,
        dintingMax: 2,
        blank: 0,
        blankMax: 1
      },
      customWords: {
        isUse: false,
        dinting: "番茄",
        civilian: "西红柿"
      },
      showMore: false,
      openAlert: false,
      getInto: false,
      gameArr: [],
      showGameInterface: false,
      entry: []
    };
  },
  mounted() {
    axios
      .get("http://api.a-1.vip", {
        params: {
          url: "http://a-1.vip/demo/dinting/data/data.json"
        }
      })
      .then(({ data }) => {
        this.entry = data;
      });
  },
  methods: {
    startAgain() {
      this.getInto = false;
      this.showGameInterface = false;
    },
    toggle(panel) {
      this.panel = panel === this.panel ? "" : panel;
    },
    sliderChange(props) {
      if (props === "players") {
        let max = Math.floor(this.config[props] / 3);
        this.config.dintingMax = max;
        if (this.config.dinting > this.config.dintingMax)
          this.config.dinting = max;
        max = Math.floor(this.config[props] / 5);
        this.config.blankMax = max;
        if (this.config.blank > this.config.blankMax) this.config.blank = max;
      }
    },
    // [函数] 生成从minNum到maxNum的随机数
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    },
    startGame() {
      const arr = [],
        entry = {
          civilian: "[无可用词条]",
          blank: "",
          dinting: "[无可用词条]"
        };
      let i = 0;
      let len = this.config.players;
      if (this.customWords.isUse) {
        entry.civilian = this.customWords.civilian;
        entry.dinting = this.customWords.dinting;
      } else {
        if (this.entry.length == 0) {
          alert("没有可用的词条！");
          return;
        }
        let index = this.randomNum(0, this.entry.length - 1);
        entry.civilian = this.entry[index].civilian;
        entry.dinting = this.entry[index].dinting;
      }
      for (let i = 0; i < len; i++) {
        arr.push({
          name: "No." + (i + 1),
          identity: "civilian",
          entry: entry.civilian,
          beViewed: false,
          open: false
        });
      }
      i = 1;
      while (i <= this.config.blank) {
        let index = this.randomNum(1, len - 1);
        if (arr[index].identity == "blank") continue;
        arr[index].identity = "blank";
        arr[index]["entry"] = entry["blank"];
        i++;
      }
      i = 1;
      while (i <= this.config.dinting) {
        let index = this.randomNum(0, len - 1);
        if (arr[index].identity == "dinting" || arr[index].identity == "blank")
          continue;
        arr[index].identity = "dinting";
        arr[index]["entry"] = entry["dinting"];
        i++;
      }
      this.gameArr = arr;
      // console.log('---------------------------------------');
      // arr.forEach((ele,index) => {
      //   if(ele.identity!='civilian'){
      //   console.log(index,ele.identity=='blank'?'白板':'卧底');
      //   }
      // });

      this.getInto = true;
    }
  }
};
</script>

<style lang="less">
body {
  .mu-dialog-wrapper {
    .mu-dialog-body {
      padding: 0 25px;
      .mu-input {
        width: 100%;
      }
    }
    .mu-dialog-title {
      padding: 15px 24px;
      padding-bottom: 5px;
    }
  }
}
#app {
  position: relative;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .mu-slider {
    margin: 0;
  }
  .head {
    z-index: 1;
    position: relative;
    height: 30vh;
    background: rgba(58, 131, 131, 0.2);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-image: url("http://p9.qhimg.com/bdm/960_593_0/t015a5ad35a3de8a5ab.jpg");

    .mu-fab-button {
      position: absolute;
      right: 20px;
      bottom: -29px;
      box-shadow: none;
    }
    .mu-fab-button:active {
      box-shadow: none;
    }
    .title {
      position: absolute;
      left: 20px;
      bottom: 15px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 8vw;
    }
  }
  .body {
    padding-top: 10vh;
    height: 70vh;

    .more-wrap {
      .mu-transition-row {
        margin-bottom: 10px;
        .col {
          padding: 0;
          text-align: center;
          .mu-button {
            width: 90%;
            .mu-button-wrapper {
              padding: 0;
              justify-content: left;
              padding: 0 10px;
              .glyphicon {
                font-size: 20px;
                margin-left: 2px;
                margin-right: 10px;
              }
            }
          }
        }
      }
      .mu-transition-row:last-of-type {
        margin-bottom: 0;
      }
    }
  }
  .body {
    .container {
      padding: 0 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
