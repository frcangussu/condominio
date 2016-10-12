var StringUtil = {
 
    const ACCENT_STRINGS : 'ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËẼÌÍÎÏĨÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëẽìíîïĩðñòóôõöøùúûüýÿ',
    const NO_ACCENT_STRINGS : 'SOZsozYYuAAAAAAACEEEEEIIIIIDNOOOOOOUUUUYsaaaaaaaceeeeeiiiiionoooooouuuuyy',
 
    accentToRegex:  function ($text){
                 
                        $from = str_split(utf8_decode(StringUtil.ACCENT_STRINGS));
                        $to   = str_split(strtolower(StringUtil.NO_ACCENT_STRINGS));
                        $text = utf8_decode($text);
                        $regex = array();
                        foreach ($to as $key => $value) {
                            if (isset($regex[$value])) {
                                $regex[$value] .= $from[$key];
                            } else {
                                $regex[$value] = $value;
                            }
                        }
                        foreach ($regex as $rg_key => $rg) {
                            $text = preg_replace("/[$rg]/", "_{$rg_key}_", $text);
                        }
                        foreach ($regex as $rg_key => $rg) {
                            $text = preg_replace("/_{$rg_key}_/", "[$rg]", $text);
                        }
                 
                        return utf8_encode($text);
                    }
}

// module.exports = StringUtil;