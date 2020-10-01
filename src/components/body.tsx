import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RouteView, { RouteList } from '../view/route'
import LoadingIcon from "../loading_icon.gif";
import { APPLICATION_CONTEXT, VIEW_CONTEXT } from "../lib";
import { links } from "../lib/util";
import { Logout } from './logout'
import { Login } from "../view/login";
import { Register } from "../view/register";
import { AuthGuard } from "./guard";
import { Dashboard } from "../view/dashboard";


const Loading = () => {
    return (
        <div className='is-flex-centered' style={{ height: '100%', filter: 'grayscale(1)' }}>
            <figure className='image is-128x128'>
                <img src={LoadingIcon} />
            </figure>
        </div>
    )
}

export const BodyFragment = ({ loading, children }: { loading?: boolean, children?: any }) => {
    return (
        <div className='App-Body'>
            {loading ? <Loading /> : <>{children}</>}
        </div>
    )
}

export const Body = ({ showLoading }: { showLoading?: boolean }) => {
    const ctx = useContext(APPLICATION_CONTEXT)
    const viewCTX = useContext(VIEW_CONTEXT)
    // showLoading = showLoading
    if (showLoading) { return <BodyFragment loading /> }
    else {
        return (
            <Switch>
                <Route path={links.login} exact>
                    <Login />
                </Route>
                <Route path={links.register} exact>
                    <Register />
                </Route>

                <Route path={links.logout} exact>
                    <Logout />
                </Route>

                <AuthGuard path={links.dashboard}>
                    <Dashboard />
                </AuthGuard>

                <Route path={'/'} strict={false} exact={true}>
                    {ctx.signedIn() && viewCTX.signedIn ? <Redirect to={links.dashboard} /> : <Redirect to={links.login} />}
                </Route>


                <Route >
                    <BodyFragment loading={showLoading}>
                        <div className='container is-fluid'>
                            <p> {`ldll`}</p>

                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad quos reiciendis amet sed et quae ea, facere aspernatur repudiandae nemo nulla quasi mollitia? Velit dicta dolor quis debitis, quasi deserunt distinctio recusandae possimus numquam totam, laudantium amet! Consequatur perspiciatis voluptas aliquid rerum dolore libero repellendus voluptate voluptatibus praesentium neque debitis voluptatum, blanditiis doloremque alias iste reprehenderit vel sint eveniet in nulla optio soluta reiciendis odit! Modi ut nesciunt ipsam, accusantium autem cupiditate eius voluptatibus quidem nihil, fuga, reiciendis qui commodi obcaecati omnis! Voluptatem provident, atque repellendus velit commodi quos? Dolores, illum dolore officia accusantium suscipit facere amet, sapiente maiores animi rerum quia magni obcaecati culpa. Placeat sapiente quas impedit reiciendis veniam illum dolorum, accusantium voluptatibus aliquid voluptatem et, nihil saepe adipisci quasi nostrum. Natus explicabo nam at quisquam, aut perspiciatis corrupti voluptatum, quasi accusantium distinctio rerum autem? Ex tempora, et consectetur ratione atque laborum dolore in aliquam iste vitae odio architecto obcaecati hic voluptate saepe ipsam veniam sit magnam porro animi commodi fugiat assumenda eligendi. Qui vero numquam possimus velit commodi, voluptas quod quasi debitis laborum corporis voluptate. Velit dolores quidem perspiciatis molestias rerum accusantium error. Saepe sapiente iste magni odio exercitationem nihil sequi dolorum. Assumenda enim officiis unde reprehenderit laboriosam provident aliquid numquam nisi sapiente excepturi culpa quasi optio necessitatibus magni ratione voluptatum, fuga facilis saepe quae aspernatur tempore delectus temporibus quia. Sunt ea itaque tenetur qui temporibus libero totam natus necessitatibus obcaecati praesentium a nemo voluptatum, aspernatur similique dolorem ullam ab magnam voluptate? Deserunt voluptates porro iste suscipit amet maxime optio sequi, vitae, repellendus delectus praesentium modi tempore dicta ex, aspernatur aut. Cupiditate, rem quam tempora eius, iste vero a magni officia excepturi molestias odio aliquid, neque aliquam? Illum recusandae dolorum quaerat iure, perspiciatis totam autem corrupti nam facere harum iusto libero possimus cupiditate ipsa nesciunt! Fugiat sit voluptates ducimus, nesciunt nihil recusandae. Quae necessitatibus fugit nihil facere molestias similique, fuga consectetur aut quis! Iste, minus eveniet molestiae ducimus distinctio accusamus esse quam iusto quidem placeat similique quae consequuntur! Quae nisi laboriosam architecto voluptatibus recusandae qui ab possimus at assumenda temporibus itaque aliquid atque necessitatibus inventore, obcaecati perferendis modi nulla porro vero. Voluptate quia ad facere eveniet sequi officia, vitae, minima pariatur nulla, iste vel unde quibusdam praesentium sint recusandae consectetur? Voluptates dolor voluptatum autem est adipisci recusandae unde sint, fuga cupiditate, nisi enim in eveniet sed ut repellendus consectetur perferendis earum, qui minus ratione. Autem, ea? Adipisci ratione laboriosam nobis impedit placeat deleniti, nihil neque libero unde nemo magni commodi error saepe quasi nesciunt? Dolor, ea ipsa hic, exercitationem cum asperiores, aliquid accusantium assumenda ipsam beatae tempore iure voluptate aliquam repudiandae? Neque earum, obcaecati, excepturi aperiam expedita aut nam culpa nulla, provident eos repellendus? Voluptas ut et, quisquam quo iste a ipsam sunt porro amet laboriosam deserunt, quod aliquid eveniet suscipit esse soluta repellendus voluptate, itaque in. Tempore quo suscipit architecto, quis quidem alias voluptatem asperiores quisquam, nemo ea vel sapiente ipsum fuga beatae explicabo quos id eius ducimus aliquam neque earum! Natus recusandae ut a temporibus itaque rerum, labore impedit adipisci distinctio! Amet, dolorem! Voluptas quos cum sint delectus, asperiores enim cumque veritatis sit optio ipsa maiores tempora porro quidem eum molestias qui saepe. Officia quod nemo ducimus aut et corrupti consequuntur dolor nihil tenetur beatae deserunt doloribus, debitis dicta eligendi accusantium blanditiis. Necessitatibus velit adipisci nam beatae at quos dolor nihil non voluptatibus vel impedit ea, placeat voluptates possimus ratione ipsa, in, sed autem ab rerum quae ducimus eius nostrum? Adipisci laborum atque ullam delectus quo quidem tempore sint! Dolorum odit rem adipisci. Illo molestiae quas, est aspernatur quam suscipit! Autem eos natus quisquam magnam fugit consequatur est unde fuga perferendis vel ducimus, beatae non veniam qui ipsum saepe maiores ipsam blanditiis deserunt esse. Quaerat, cupiditate. Nobis odit dignissimos harum, commodi itaque reprehenderit, sed alias perferendis praesentium qui expedita, accusamus excepturi ea. Pariatur ipsam odit accusantium, maiores eius omnis in dolorem sit commodi! Ut consequatur, minima quas exercitationem provident accusamus commodi. Quo odio voluptatem libero ducimus nesciunt dolore optio quisquam minus accusantium, ipsa architecto iusto iure temporibus culpa, ut minima impedit voluptas odit. Eos sit quam, enim unde beatae voluptas qui obcaecati nulla veritatis quisquam maxime voluptates suscipit at minus omnis a similique officiis quae, eligendi aliquid debitis. Libero reprehenderit necessitatibus sit minima doloribus omnis dolore dignissimos, incidunt, consectetur quasi eligendi cum nisi voluptatem culpa dicta. Eum enim obcaecati corrupti voluptates? Cum nam debitis itaque dolorum ad iusto est eum vel, voluptate fugiat accusamus autem voluptates excepturi nisi tempora architecto delectus, atque ut adipisci numquam amet non! Suscipit consectetur earum, quis voluptatibus libero impedit mollitia? Maxime consectetur dolore hic perferendis nam libero delectus, deleniti quaerat, quasi asperiores nisi aliquam velit! Eligendi necessitatibus sint blanditiis porro quibusdam culpa? Rem error accusamus suscipit nobis dolorem distinctio repellendus consequatur eius officia, est animi earum quis, numquam dignissimos libero eaque dolor quasi praesentium veniam magnam aperiam ullam labore odio! Ducimus fugiat minima dicta sapiente fugit libero commodi tempore molestias dolore ea, culpa incidunt nam dignissimos quo aut voluptate accusamus! Sed repellendus maxime iure delectus laborum fugiat fuga ut autem esse. Voluptatibus tempore atque accusamus, reprehenderit, distinctio corrupti eligendi cupiditate saepe quae sint commodi qui voluptate voluptatem, repudiandae fugiat odio quibusdam. Repellendus doloremque tempore aperiam a soluta fuga iure magni temporibus nisi, inventore sequi odio debitis ducimus neque. Nihil tenetur a nesciunt provident error sequi adipisci minima, incidunt odit dicta natus quisquam at quia reprehenderit asperiores, blanditiis, eveniet recusandae inventore.
                </div>
                    </BodyFragment>
                </Route>
            </Switch>
        )
    }
}


