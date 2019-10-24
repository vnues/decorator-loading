# decorator-loading

## ❗️❗️背景

> 在项目中使用 loading，一般是在组件中用一个变量（ 如 isLoading)来保存请求数据时的 loading 状态，请求 api 前将 isLoading 值设置为 true，请求 api 后再将 isLoading 值设置为 false，从而对实现 loading 状态的控制,但是如果很多异步需求都这样做势必会增加冗余代码，而且对 loading 状态的控制与我们的业务完全无关，我们完全可以解耦出来,所以使用装饰器抽离这部分逻辑代码

## ⛽️⛽️如何使用

```javascript
import loading from "decorator-loading"
class Demo extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      count: 0
    }
  }
 @loading()
  public  sendGetDemoReq() {
    axios.get('/user?ID=12345')
            .then(function (response) {
              // handle success
              console.log(response);
      })
  }
  public render() {
    return (
      <div styleName="page-demo">
        <h2>hellos 🍺🍺🍺🍺🍺🍺</h2>
        <Button onClick={this.sendGetDemoReq} type="primary" style={{ marginTop: '8px' }}>
          request
        </Button>
        {window.isLoading&&<YourLoading />}
      </div>
    )
  }
}
```

## 参数

> 现在支持的是一个全局window参数，所以我们建议你初始化的时候就先把这个参数挂载到window上,当然你如果不想挂载到window上，而是自定义变量（现在还没有支持这个操作）,你可以直接copy这个`装饰器`代码进行修改

| 参数名 | 值 |
| ------ | ------ |
| window.isLoading | false |


## 装饰器代码

```javascript
module.exports = loading = () => {
  return function (
    target,
    name,
    descriptor
  ) {
    let v
    return {
      enumerable: true,
      configurable: true,
      get: function () {
        if (descriptor) {
          v = descriptor.value
        }
        if (typeof v === 'function') {
          return async function () {
            window.isLoading = true
            try {
              await v.apply(this, arguments)
            } catch (error) {
              // 做一些错误上报之类的处理 
              throw error;
            } finally {
              window.isLoading = false
            }

          }
        }
      },
      set: function (c) {
        v = c;
      }
    }
  }
}
```