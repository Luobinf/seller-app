<template>
  <div class="dialog-mask-wrapper">
    <transition name="out">
      <div class="dialog-wrapper" v-show="showDialog">
        <div class="dialog">
          <div class="title">
            <slot></slot>
          </div>
          <div class="buttons">
            <button class="cancel" @click="cancel">取消</button>
            <button class="confirm" @click="confirm">确定</button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="showDialog"></div>
    </transition>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'Dialog',
    data() {
      return {}
    },
    props: {
      showDialog: {
        type: Boolean
      }
    },
    methods: {
      cancel() {
        this.$emit('update:showDialog', false)
        //Dialog点击取消之后的回调
        this.$emit('handle-cancel')
      },
      confirm() {
        //Dialog点击确认之后的回调
        this.$emit('update:showDialog', false)
        this.$emit('handle-confirm')
      },
    }
  }
</script>

<style scoped lang="scss">
  @keyframes out {
    0% {
      transform: scale(0.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .dialog-mask-wrapper {
    .dialog-wrapper {
      position: fixed;
      top: 50%;
      left: 50%;
      min-width: 250px;
      z-index: 300;
      transform: translate(-50%, -50%);

      &.out-enter-active {
        transition: all 0.3s;

        .dialog {
          animation: out 0.3s;
        }
      }

      &.out-leave-active {
        transition: all 0.3s;
      }

      &.out-enter, &.out-leave-to {
        opacity: 0;
      }

      .dialog {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

        .title {
          padding: 30px 10px;
          text-align: center;
          border-bottom: 1px solid #d9dde1;
        }

        .buttons {
          display: flex;
          width: 100%;

          .cancel, .confirm {
            width: 50%;
            border: none;
            padding: 10px;
            background-color: white;
            font-size: 14px;
            color: #b2b2b2;
            transition: all 0.3s;

            &:focus {
              outline: none;
              background-color: #f5f5f5;
            }
          }

          .confirm {
            border-left: 1px solid #d9dde1;
            color: orange;
          }
        }
      }
    }

    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 200;
      background-color: rgba(7, 17, 24, 0.7);

      &.fade2-enter-active, &.fade2-leave-active {
        transition: all 0.3s;
      }

      &.fade2-enter, &.fade2-leave-to {
        opacity: 0;
        background-color: rgba(7, 17, 24, 0);
      }
    }
  }

</style>
