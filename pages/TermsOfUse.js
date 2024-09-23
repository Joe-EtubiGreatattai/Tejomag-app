import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";

import CustomLoader from '../components/CustomLoader';

const TermsOfUse = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setLoading(false); // Stop loading once fonts are loaded
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
        <CustomLoader text="Please wait..." />
        </View>
      ) : (
        <>
          <Text
            style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}
          >
            Termos e Condições
          </Text>

          <ScrollView>
            <Text style={styles.bodyText}>
              Bem-vindo a TejoMag! Estes termos e condições descrevem as regras
              e regulamentos para o uso do site de TejoMag, localizado
              em https://www.tejomag.pt. Ao aceder a este site, presumimos que
              aceita estes termos e condições. Não continue a usar TejoMag se
              não concordar com todos os termos e condições declarados nesta
              página. Cookies: O site usa cookies para ajudar a personalizar a
              sua experiência online. Ao aceder TejoMag, concordou em usar os
              cookies necessários. Um cookie é um arquivo de texto colocado no
              seu disco rígido por um servidor de páginas web. Os cookies não
              podem ser usados para executar programas ou enviar vírus para o
              seu computador. Os cookies são atribuídos exclusivamente a si e só
              podem ser lidos por um servidor web no domínio que emitiu o
              cookie. Podemos usar cookies para recolher, armazenar e rastrear
              informações para fins estatísticos ou de marketing para operar o
              nosso site. Tem a opção de aceitar ou recusar Cookies opcionais.
              Existem alguns Cookies necessários para o funcionamento do nosso
              site. Esses cookies não exigem o seu consentimento. Lembre-se de
              que, ao aceitar os cookies necessários, também aceita cookies de
              terceiros, que podem ser usados por meio de serviços fornecidos
              por terceiros se usar esses serviços no nosso site, por exemplo,
              uma janela de exibição de vídeo fornecida por terceiros e
              integrada no nosso site. Licença: Salvo indicação em contrário,
              TejoMag e/ou os seus licenciados possuem os direitos de
              propriedade intelectual de todo o material em TejoMag. Todos os
              direitos de propriedade intelectual são reservados. Pode aceder de
              TejoMag para o seu uso pessoal sujeito às restrições definidas
              nestes termos e condições. Não deve: Copiar ou republicar o
              material de TejoMag Vender, alugar ou sublicenciar o material de
              TejoMag Reproduzir, duplicar ou copiar o material de TejoMag
              Redistribuir o conteúdo de TejoMag Este acordo deve iniciar na
              data deste documento. Partes deste site oferecem aos utilizadores
              a oportunidade de postar e trocar opiniões e informações em certas
              áreas do site. TejoMag não filtra, edita, publica ou analisa os
              comentários no site. Os comentários não refletem as visões e
              opiniões de TejoMag, seus agentes e/ou afiliados. Os comentários
              refletem os pontos de vista e as opiniões da pessoa que posta os
              seus pontos de vista e opiniões. Na medida do permitido pelas leis
              aplicáveis, TejoMag não será responsável pelos comentários ou
              qualquer responsabilidade, danos ou despesas causados e/ou
              sofridos como resultado de qualquer uso e/ou publicação e/ou
              aparência de comentários neste site. TejoMag reserva-se o direito
              de monitorizar todos os comentários e remover quaisquer
              comentários que possam ser considerados inadequados, ofensivos ou
              que causem violação destes Termos e Condições. Garante e declara
              que: tem o direito de postar os comentários no nosso site e tem
              todas as licenças e consentimentos necessários para fazê-lo; os
              comentários não invadem nenhum direito de propriedade intelectual,
              incluindo, sem limitação, direitos de autor, patentes ou marcas
              comerciais de terceiros; os comentários não contêm nenhum material
              difamatório, calunioso, ofensivo, indecente ou de outra forma
              ilegal, o que constitui uma invasão de privacidade. os comentários
              não serão usados para solicitar ou promover negócios ou customizar
              ou apresentar atividades comerciais ou atividades ilegais. Concede
              a TejoMag uma licença não exclusiva para usar, reproduzir, editar
              e autorizar outros a usar, reproduzir e editar qualquer um de seus
              comentários em todas e quaisquer formas, formatos, ou mídia.
              Hiperlinks para o nosso conteúdo: As seguintes organizações podem
              vincular-se ao nosso site sem aprovação prévia por escrito:
              Agências governamentais; Mecanismos de pesquisa; Organizações de
              notícias; Os distribuidores de diretórios online podem ter links
              para o nosso site da mesma maneira que fazem um hiperlink para
              sites de outras empresas listadas; e Negócios credenciados em todo
              o sistema, exceto a solicitação de organizações sem fins
              lucrativos, centros de caridade e grupos de angariação de fundos
              de caridade que não podem ter um link para o nosso site. Essas
              organizações podem incluir links para a nossa página inicial,
              publicações ou outras informações do site, desde que o link: (a)
              não seja de forma alguma enganoso; (b) não implique falsamente um
              patrocínio, endosso ou aprovação da parte vinculante e de seus
              produtos e/ou serviços; e (c) se enquadra no contexto do site da
              parte vinculante. Podemos considerar e aprovar outras solicitações
              de links dos seguintes tipos de organizações: fontes de
              informações comerciais e / ou de consumidores comumente
              conhecidas; sites da comunidade dot.com; associações ou outros
              grupos que representam instituições de caridade; distribuidores de
              diretórios online; portais de internet; firmas de contabilidade,
              advocacia e consultoria; e instituições educacionais e associações
              comerciais. Aprovaremos as solicitações de link dessas
              organizações se decidirmos que: (a) o link não nos faria parecer
              desfavoravelmente para nós mesmos ou para nossos negócios
              credenciados; (b) a organização não possui registros negativos
              conosco; (c) o benefício para nós da visibilidade do hiperlink
              compensa a ausência de TejoMag; e (d) o link está no contexto de
              informações gerais de recursos. Essas organizações podem ter um
              link para nossa página inicial, desde que o link: (a) não seja de
              forma alguma enganoso; (b) não implique falsamente em patrocínio,
              endosso ou aprovação da parte vinculante e de seus produtos ou
              serviços; e (c) se enquadra no contexto do site da parte
              vinculante. Se é uma das organizações listadas no parágrafo 2
              acima e está interessado em criar um link para o nosso site,
              deve-nos informar enviando um email para TejoMag. Inclua o seu
              nome, o nome da sua organização, informações de contato, bem como
              o URL do seu site, uma lista de todos os URLs dos quais pretende
              criar um link para o nosso site e uma lista dos URLs do nosso site
              aos quais gostaria de linkar. Espere 2 a 3 semanas por uma
              resposta. Organizações aprovadas podem ter um hiperlink para nosso
              site da seguinte forma: Pelo uso do nosso nome corporativo; ou
              Pelo uso do localizador uniforme de recursos ao qual está
              vinculado; ou Usando qualquer outra descrição do nosso site
              vinculado que faça sentido dentro do contexto e formato do
              conteúdo do site da parte vinculante. Não será permitido o uso do
              logotipo da TejoMag ou outra arte para criar links na ausência de
              um contrato de licença de marca registada. Responsabilidade pelo
              conteúdo: Não seremos responsabilizados por qualquer conteúdo que
              apareça no seu site. Concorda em proteger-nos e defender contra
              todas as reclamações levantadas no seu site. Nenhum link deve
              aparecer em qualquer site que possa ser interpretado como
              calunioso, obsceno ou criminoso, ou que infrinja, de outra forma
              viole ou defenda a violação ou outra violação de quaisquer
              direitos de terceiros. Reserva de direitos: Reservamos o direito
              de solicitar que remova todos os links ou qualquer link específico
              para o nosso site. Aprova a remoção imediata de todos os links
              para nosso site, mediante solicitação. Também nos reservamos o
              direito de alterar estes termos e condições e a sua política de
              vinculação a qualquer momento. Ao conectar-se continuamente ao
              nosso site, concorda em cumprir e seguir estes termos e condições
              de vinculação. Remoção de links do nosso site: Se encontrar algum
              link no nosso site que seja ofensivo por qualquer motivo, pode
              contactar-nos e informar-nos a qualquer momento. Consideraremos as
              solicitações de remoção de links, mas não somos obrigados a
              fazê-lo ou a responder diretamente. Não garantimos que as
              informações neste site sejam corretas. Não garantimos sua
              integridade ou precisão, nem prometemos garantir que o site
              permaneça disponível ou que o material nele contido seja mantido
              atualizado. Isenção de responsabilidade: Na extensão máxima
              permitida pela lei aplicável, excluímos todas as representações,
              garantias e condições relacionadas ao nosso site e ao uso deste
              site. Nada nesta isenção de responsabilidade: limitará ou excluirá
              a nossa responsabilidade por morte ou danos pessoais; limitar ou
              excluir a nossa responsabilidade ou a sua responsabilidade por
              fraude ou deturpação fraudulenta; limitar qualquer uma das nossas
              responsabilidades de qualquer forma que não seja permitida pela
              lei aplicável; ou excluir qualquer uma das nossas ou suas
              responsabilidades que não possam ser excluídas sob a lei
              aplicável. As limitações e proibições de responsabilidade
              definidas nesta seção e em outras partes desta isenção de
              responsabilidade: (a) estão sujeitas ao parágrafo anterior; e (b)
              regem todas as responsabilidades decorrentes da isenção de
              responsabilidade, incluindo responsabilidades decorrentes de
              contratos, atos ilícitos e por violação de dever estatutário.
              Desde que o site e as informações e serviços nele fornecidos sejam
              gratuitos, não seremos responsáveis por perdas ou danos de
              qualquer natureza.
            </Text>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 10,
    marginHorizontal: "auto",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bodyText: {
    fontSize: 16,
    color: "#404040",
    marginTop: 10,
    lineHeight: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#404040",
  },
});

export default TermsOfUse;
