#!/bin/sh

#if false; then

#fi

path=./prd

for file in ${path}/*; do
    
    if test -f $file; then
        htmlarr=(${htmlarr[*]} ${file})
    else
        arr=(${arr[*]} ${file##*/})
    fi

done

echo '页面文件 ：'${htmlarr[*]}
echo '历史版本号 ：'${arr[*]}

param=$1
num='-?[0-9]+'
reg='v_[0-9]{14}_[0-9a-z]{8}'
tempreg=${reg//\{/\\\{}
tempreg=${tempreg//\}/\\\}}

function changeVersion() {

    for html in ${htmlarr[*]}; do

        # 逐行匹配版本号，进行替换更改
        sed -i '' 's/\('${tempreg}'\)/'$1'/g' $html

    done

}

if [[ "$param" =~ ^$reg$ ]]; then
    
    changeVersion ${param}
    echo '更改至版本号 ：'${param}

elif [[ "$param" =~ ^$num$ ]]; then
    
    for line in $(cat ${htmlarr[0]}); do

        ver=$(echo $line | sed 's/.*\('${tempreg}'\).*/\1/g')
        if [[ "$ver" =~ ^$reg$ ]]; then
            echo '当前版本号 ：'$ver
            for ((i=0;i<${#arr[*]};i++)); do
                if [[ "${arr[i]}" == "$ver" && $(expr $i + $param) -ge 0 && $(expr $i + $param) -lt ${#arr[*]} ]]; then
                    currver=${arr[$(expr $i + $param)]}
                    changeVersion ${currver}
                    echo '更改至版本号 ：'${currver}
                fi
            done
            break
        fi

    done
    
else

    echo '版本号修改异常'

fi
