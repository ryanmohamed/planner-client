import { motion, AnimatePresence } from 'framer-motion'
import { Key } from 'react';
import useMeasure from "react-use-measure";
import ignoreCircularReferences from '../../lib/ignoreCircularReferences';

// idea courtesy of sam selikoff - https://github.com/samselikoff/2022-06-09-resizable-panel/commit/fe04a842367657b4acb1058c454d3eca739c419d
export default function ResizeablePanel({ d, children, ...props }: any){
    let [ ref, { height }] = useMeasure()
    return (
        <motion.div
            animate={{ height }}
            {...props}
        >
            {/* inner wrapper for content animation */}
            <AnimatePresence mode='wait'>
            <motion.div
                // doesn't rerender for the children, so we need a key that exists outside of the render cycle, that will change and cause an update
                // the most intuitive approach is to use the children themselves as a key
                // we usually get usually due to it being a complex data structure with circular references to itself
                // lets use a work around found in github issues
                key={JSON.stringify(children, ignoreCircularReferences())} // second argument mutates the passed in object
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: d } }}
                exit={{ opacity: 0, transition: {  duration: d } }}
            >
                <div ref={ref}>
                    { children }
                </div>
            </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}