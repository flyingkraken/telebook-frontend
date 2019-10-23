export class Graph {
  constructor (
    leftNode,
    edgeType,
    rightNode,
    LeftMetadata,
    rightMetadata,
    graphMetadata,
    nodeId
  ) { 
    this.leftNode = leftNode
    this.edgeType = edgeType
    this.rightNode = rightNode
    this.LeftMetadata = LeftMetadata
    this.rightMetadata = rightMetadata
    this.graphMetadata = graphMetadata
    this.nodeId = nodeId
  }
}
