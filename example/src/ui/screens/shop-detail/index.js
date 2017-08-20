import {inject} from 'mobx-react'
import ShopDetail from './screen'


export default inject(({router}, {params}) => {
  const {location, pop} = router;
  const {shop} = params;
  return {shop, location, pop}
})(ShopDetail)
