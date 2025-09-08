import React from "react";
import { View, Text, Pressable } from "react-native";
import Swiper from "react-native-deck-swiper";
import USERS from "../data/users";
import useMatchStore from "../store/matchStore";
import { t } from "../i18n/dict";
import { useTheme } from "../theme/theme";

export default function SwipeScreen({ navigation }) {
  const { colors: c } = useTheme();
  const [index, setIndex] = React.useState(0);
  const like = useMatchStore(s=>s.like);
  const dislike = useMatchStore(s=>s.dislike);
  const likedCount = useMatchStore(s=>s.likedIds.length);
  const filters = useMatchStore(s=>s.filters);
  const lang = useMatchStore(s=>s.lang);

  const filtered = React.useMemo(()=>{
    const [min,max] = filters.ageRange || [20,35];
    return USERS.filter(u => (!filters.gender || u.gender===filters.gender) && u.age>=min && u.age<=max);
  },[filters]);
  React.useEffect(()=>{ setIndex(0); },[filters]);

  return (
    <View style={{ flex:1, backgroundColor:c.bg, paddingTop:56, paddingHorizontal:16 }}>
      <View style={{ position:"absolute", top:12, left:12, backgroundColor:c.badge, paddingVertical:6, paddingHorizontal:10, borderRadius:10 }}>
        <Text style={{ color:c.text, fontWeight:"800" }}>
          {t(lang,"filter")} {filters.gender ?? t(lang,"all")}  {filters.ageRange[0]}~{filters.ageRange[1]}
        </Text>
      </View>
      <View style={{ position:"absolute", top:12, right:12, backgroundColor:c.badge, paddingVertical:6, paddingHorizontal:10, borderRadius:10 }}>
        <Text style={{ color:c.text, fontWeight:"800" }}>{t(lang,"likes_heart")} {likedCount}</Text>
      </View>
      <Pressable onPress={()=>navigation.navigate("Filter")} style={{ position:"absolute", top:12, alignSelf:"center", backgroundColor:c.muted, paddingVertical:6, paddingHorizontal:10, borderRadius:10 }}>
        <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"edit_filter")}</Text>
      </Pressable>

      <Swiper
        cards={filtered}
        cardIndex={index}
        onSwiped={()=>setIndex(i=>i+1)}
        onSwipedLeft={(ci)=>{ const ccard=filtered[ci]; if(ccard) dislike(ccard.id); }}
        onSwipedRight={(ci)=>{ const ccard=filtered[ci]; if(ccard) like(ccard.id); }}
        stackSize={3}
        backgroundColor={c.bg}
        overlayLabels={{
          left:{  title:t(lang,"no_label"),   style:{ label:{ color:c.danger,  fontSize:32, fontWeight:"800" } } },
          right:{ title:t(lang,"like_label"), style:{ label:{ color:c.success, fontSize:32, fontWeight:"800" } } }
        }}
        renderCard={(card)=>!card? <View style={{flex:1}}/> : (
          <View style={{ flex:1, borderRadius:16, backgroundColor:c.card, padding:20, justifyContent:"center" }}>
            <Text style={{ color:c.text, fontSize:22, fontWeight:"800", marginBottom:8 }}>{card.name}</Text>
            <Text style={{ color:c.subtle }}>{card.gender==="M"?t(lang,"male"):t(lang,"female")}  {card.age}</Text>
            <Text style={{ color:c.accent, marginTop:8 }}>#{card.tags.join(" #")}</Text>
          </View>
        )}
      />
    </View>
  );
}
