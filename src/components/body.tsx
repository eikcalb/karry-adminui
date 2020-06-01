import React from "react";
import { Switch, Route } from "react-router-dom";
import LoadingIcon from "../loading_icon.gif";

export const BodyFragment = ({ loading }: { loading?: boolean }) => {
    return (
        <div className='section App-Body'>
            {loading ? <Loading /> : <div className='container is-fluid'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse mollitia quibusdam veritatis porro quam, dolorum dolor. Eaque quasi laudantium officia itaque debitis doloremque in corporis architecto excepturi? Suscipit hic vero quo maiores commodi magni exercitationem officia corrupti vel quis excepturi sapiente mollitia ipsam alias quidem accusamus id consectetur enim, blanditiis maxime perspiciatis neque saepe? Eaque autem dolorem repudiandae corporis beatae debitis veritatis eum aspernatur impedit, animi minima exercitationem est veniam quidem quam dolor ratione odio vero perspiciatis, incidunt sint assumenda facilis. Modi inventore asperiores architecto repudiandae numquam enim eius nobis aspernatur! Reprehenderit sed ab neque aspernatur. Hic magnam, quisquam, harum laborum incidunt est commodi repudiandae excepturi consequuntur blanditiis neque atque autem officia tempora debitis voluptatem aut minima quibusdam ab? Mollitia placeat rerum repudiandae pariatur corrupti dolorem, adipisci at asperiores est molestiae suscipit inventore excepturi facere ullam iste sequi, assumenda iure labore vero quasi porro possimus ad, doloribus numquam. Asperiores iste, praesentium, quis veniam dolorum, non labore dicta ipsum et fugiat cumque? Exercitationem, alias, inventore architecto nesciunt quod explicabo accusamus eum esse cumque quam rem, voluptatem at expedita in. Necessitatibus esse, earum deleniti quae vel natus alias ratione, nemo dolor harum sapiente sunt, error nisi quibusdam nam tempore voluptatum placeat illum? Tempora saepe ea dolor et consequuntur blanditiis, culpa, cum facilis quod exercitationem voluptatibus sequi distinctio deserunt optio magnam aliquid id soluta? Suscipit natus iure iste earum. Eaque doloribus, voluptatum eius officiis saepe quia maxime cumque deserunt debitis aut exercitationem eveniet in. Nostrum, dolores nesciunt voluptas voluptates eum velit. Sapiente delectus optio neque, eos earum vero ab iure assumenda corrupti, explicabo a atque laborum quisquam aliquid recusandae provident illum culpa hic. Veritatis in nihil id et ex repellat sed quasi minima excepturi similique! Quia praesentium impedit neque? Accusantium sequi vel reprehenderit minus voluptates aspernatur non inventore possimus labore ab quidem, assumenda soluta repellat ad itaque, numquam architecto porro nobis sed autem? Obcaecati veritatis aliquid sequi cumque eveniet consequatur sed, repellat itaque!
            </div>}
        </div>
    )
}


export const Body = () => {
    return (
        <Switch>
            <Route render={() => <BodyFragment loading={true}></BodyFragment>} />
        </Switch>
    )

}

const Loading = () => {
    return (
        <div className='is-flex-centered' style={{ height: '100%', filter: 'grayscale(1)' }}>
            <figure className='image is-128x128'>
                <img src={LoadingIcon} />
            </figure>
        </div>
    )
}
