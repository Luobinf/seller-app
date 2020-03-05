<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :key="index"
          :class="itemClass" class="star-item"
    >
    </span>
  </div>
</template>

<script type="text/javascript">

  const LENGTH = 5
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default {
    name: 'Star',
    data() {
      return {}
    },
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size
      },
      itemClasses() {
        let result = []
        let score = Math.floor(this.score * 2) / 2
        let hasDecimal = score % 1 !== 0
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON)
        }
        if (hasDecimal) {
          result.push(CLS_HALF)
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/mixin.scss";

  .star {
    display: flex;
    justify-content: center;
    align-items: center;

    .star-item {
      background-repeat: no-repeat;
    }

    &.star-48 {
      .star-item {
        width: 20px;
        height: 20px;
        background-size: 20px 20px;
        margin-right: 22px;

        &:last-child {
          margin-right: 0;
        }

        &.on {
          @include imgTo2Or3("star48_on");
        }

        &.half {
          @include imgTo2Or3("star48_half");
        }

        &.off {
          @include imgTo2Or3("star48_off");
        }
      }
    }

    &.star-36 {
      .star-item {
        width: 15px;
        height: 15px;
        background-size: 15px 15px;
        margin-right: 16px;

        &:last-child {
          margin-right: 0;
        }

        &.on {
          @include imgTo2Or3("star36_on");
        }

        &.half {
          @include imgTo2Or3("star36_half");
        }

        &.off {
          @include imgTo2Or3("star36_off");
        }
      }
    }

    &.star-24 {
      .star-item {
        width: 10px;
        height: 10px;
        background-size: 10px 10px;
        margin-right: 3px;

        &:last-child {
          margin-right: 0;
        }

        &.on {
          @include imgTo2Or3("star24_on");
        }

        &.half {
          @include imgTo2Or3("star24_half");
        }

        &.off {
          @include imgTo2Or3("star24_off");
        }
      }
    }
  }
</style>
