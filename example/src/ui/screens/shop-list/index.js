import {inject} from 'mobx-react'
import ShopList from './screen'


export default inject(({router}) => {
  const onDetail = id => router.push(`/shops/${id}`);
  return {onDetail}
})(ShopList)
