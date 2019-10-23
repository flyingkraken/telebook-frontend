// - Import react components
import firebase, { firebaseRef, firebaseAuth, db } from '../../firestoreClient'
import { SocialError } from '../../class/common'
import { Graph } from '../../class/graphs'

/**
 * Firbase graph service
 *
 * @export
 * @class GraphService
 * @implements {IGraphService}
 */
export class GraphService {

  /**
   * Add graph
   */
  public addGraph = (graph, collection) => {
      return new Promise<string>((resolve,reject) => {

        let graphRef = db.collection(`graphs:${collection}`).doc()
        graphRef.set({...graph, nodeId: graphRef.id})
        .then(() => {
          resolve(graphRef.id)
        })
        .catch((error) => {
          reject(new SocialError(error.code,error.message))
        })
      })
    }

  /**
   * Update graph
   */
  public updateGraph = (graph, collection) => {
    return new Promise((resolve,reject) => {
      const graphData = this.getGraphs(collection, graph.leftNode, graph.edgeType, graph.rightNode)
      .then((result) => {
        graph.nodeId = result[0].nodeId
        let graphRef = db.collection(`graphs:${collection}`).doc(result[0].nodeId)
        .set({...graph}).then((result) => {
          resolve()
        })
      }).catch((error) => {
        reject(new SocialError(error.code,error.message))
      })
    })
  }

    /**
     * Get graphs data
     */
  public getGraphs = (collection, leftNode, edgeType, rightNode) => {
    return new Promise((resolve,reject) => {

      this.getGraphsQuery(collection,leftNode,edgeType,rightNode).then((result) => {
        let parsedData = []
        result.forEach((item) => {
          parsedData.push(item.data())
        })
        resolve(parsedData)
      })

    })
  }

  /**
   * Delete graph by node identifier
   */
  public deleteGraphByNodeId = (nodeId) => {
    return new Promise(resolve,reject) => {
      db.collection('graphs:users').doc(nodeId).delete()
      .then(function () {
        resolve()
      })
      .catch(reject)

    })
  }

  /**
   * Delete graph
   */
  public deleteGraph = (collection, leftNode, edgeType, rightNode) => {
      return new Promise((resolve,reject) => {
        this.getGraphsQuery(collection, leftNode, edgeType, rightNode)
        .then((snapshot) => {

            // Delete documents in a batch
          let batch = db.batch()
          snapshot.docs.forEach(function (doc) {
            batch.delete(doc.ref)
          })

          batch.commit().then(function () {
            resolve()
          })
        })
        .catch(reject)

      })
    }

  /**
   * Get graphs query
   */
  private getGraphsQuery = (collection, leftNode, edgeType, rightNode) => {
      return new Promise((resolve,reject) => {
        let graphsRef = db.collection(`graphs:${collection}`) as any

        if (leftNode != null) {
          graphsRef = graphsRef.where('leftNode', '==', leftNode)
        }
        if (rightNode && rightNode != null) {

          graphsRef = graphsRef.where('rightNode', '==', rightNode)
        }
        if (edgeType) {
          graphsRef = graphsRef.where('edgeType', '==', edgeType)
        }

        if (graphsRef) {
          graphsRef.get().then((result) => {

            resolve(result)
          }).catch((error) => reject(error))
        } else {
          graphsRef.get().then((result) => {
            resolve(result)
          }).catch((error) => reject(error))
        }

      })
    }

}
