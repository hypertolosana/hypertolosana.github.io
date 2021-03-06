/usr/bin/java -jar /Users/ibon/applications/closure/compiler.jar --compilation_level WHITESPACE_ONLY \
 --js ./lib/caat.js \
 --js ./game/main.js \
 --js ./math/random.js \
 --js ./model/solitaireNamespace.js \
 --js ./model/action/action.js \
 --js ./model/action/actionCardVisible.js \
 --js ./model/action/actionTransfer.js \
 --js ./model/condition/condition.js \
 --js ./model/condition/conditionAnd.js \
 --js ./model/condition/conditionOr.js \
 --js ./model/condition/conditionOperator.js \
 --js ./model/condition/conditionCardIsVisible.js \
 --js ./model/condition/conditionCardPositionInPile.js \
 --js ./model/condition/conditionCardSuit.js \
 --js ./model/condition/conditionCardSuitColor.js \
 --js ./model/condition/conditionCardSequence.js \
 --js ./model/condition/conditionPileInSequence.js \
 --js ./model/condition/conditionDropPileSize.js \
 --js ./model/condition/conditionDropPileMakeSequence.js \
 --js ./model/condition/conditionPileType.js \
 --js ./model/condition/conditionWin.js \
 --js ./model/suit.js \
 --js ./model/card.js \
 --js ./model/pile.js \
 --js ./model/deck.js \
 --js ./model/model.js \
 --js ./model/pileFoundation.js \
 --js ./model/pileTableau.js \
 --js ./model/pileStock.js \
 --js ./model/pileWaste.js \
 --js ./model/pileTransfer.js \
 --js ./game/actor/modelActor.js \
 --js ./game/bg/bgfishpond/fish.js \
 --js ./game/bg/grass/grass.js \
 --js ./game/bg/starfield/starfield.js > /tmp/sol.js
