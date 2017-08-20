import React from 'react'
import {View, Button} from 'react-native'


export default function ShopList({onDetail}) {
  const buttons = Array.from(new Array(5), (_, i) => (
    <View key={i} style={{marginTop: 8}}>
      <Button
        onPress={() => onDetail(`shop${i}`)}
        title={`Shop${i} detail`}
      />
    </View>
  ));

  return (
    <View>
      {buttons}
    </View>
  )
}
