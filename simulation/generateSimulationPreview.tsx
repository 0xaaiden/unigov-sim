import { LightningBoltIcon } from '@radix-ui/react-icons'
import { CopyBlock, atomOneLight } from 'react-code-blocks'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export default function SimulationPreview({ simConfig, ftc, setSimulationStatus }: { simConfig: any; ftc: any; setSimulationStatus: any }) {
  const handleSimulationStart = () => {
    setSimulationStatus(true)
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          className="mr-2 shadow-input shadow-black/10 "
          variant={'outline'}
          // className="mr-2 border-2 border-black/20  text-black/50 hover:text-black/80"
          // variant="outline" add cool animation on clicking
          type="button"
          onClick={() => {
            console.log('clicked', ftc)
            ftc()
          }}>
          <LightningBoltIcon
            className="mr-2 p-O"
            color="#FCD34D"
            width={16}
            height={16}
            // yellow bolt
            fill="#FCD34D"
          />
          Simulate
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="100% block">
        <AlertDialogHeader>
          <AlertDialogTitle>Simulation Config Preview</AlertDialogTitle>
          <AlertDialogDescription>
            This is a preview of the proposal config that will be simulated
            <div
              className="w-fit mono"
              style={{
                width: '100%',
                maxWidth: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                overflowX: 'auto',
              }}>
              <CopyBlock
                codeBlock
                language={'json'}
                showLineNumbers={true}
                text={JSON.stringify(simConfig, null, 2)}
                theme={atomOneLight}
                wrapLines={true}
                customStyle={{
                  width: '100%',
                  height: '250px',
                  overflowY: 'scroll',
                  borderRadius: '5px',
                  boxShadow: '1px 2px 3px rgba(0,0,0,0.35)',
                  fontSize: '1rem',
                  marginTop: '1rem',
                  fontFamily: 'monospace',
                  // margin: "0px 0.75rem",
                }}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-500 
          hover:bg-green-600
          "
            onClick={() => {
              console.log('simulation started')
              handleSimulationStart()
            }}>
            Start
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
